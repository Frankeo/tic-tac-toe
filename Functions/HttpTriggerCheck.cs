using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Azure.Data.Tables;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System;

namespace TicTacToe.Function
{
  public static class HttpTriggerCheck
  {
    private static List<string> Patterns = new() { "012", "345", "678", "036", "147", "258", "048", "246" };

    public static async Task<int[]> UpdateAndGetMoves(TableClient tableClient, CheckRequestDTO checkRequestDTO)
    {
      await tableClient.CreateIfNotExistsAsync();

      List<int> moves = new() { checkRequestDTO.Position };

      TableEntity matchResult = tableClient
        .Query<TableEntity>(x => x.PartitionKey == checkRequestDTO.PlayerName && x.RowKey == checkRequestDTO.RivalName)
        .SingleOrDefault();

      if (matchResult != null)
      {
        var previousMoves = matchResult.GetString("moves");
        moves.AddRange(previousMoves.Split(",").Select(x => Convert.ToInt32(x)));
      }

      var newEntity = new TableEntity(checkRequestDTO.PlayerName, checkRequestDTO.RivalName)
      {
        {"moves", string.Join(",", moves) }
      };
      await tableClient.UpsertEntityAsync(newEntity);

      return moves.ToArray();
    }

    public static async Task UpdateScore(TableClient scoresClient, string name, int increment) {
        var search = await scoresClient.GetEntityAsync<TableEntity>("global", name);
        var oldScore = search.Value.GetInt32("score");
        var newRegister = new TableEntity("global", name) { { "score", oldScore + increment } };
        await scoresClient.UpsertEntityAsync(newRegister);
    }
    public static async Task DeleteMatches(TableClient matchesClient, CheckRequestDTO checkRequestDTO) {
      await matchesClient.DeleteEntityAsync(checkRequestDTO.PlayerName, checkRequestDTO.RivalName);
      await matchesClient.DeleteEntityAsync(checkRequestDTO.RivalName, checkRequestDTO.PlayerName);
    }

    public static async Task<CheckResponseDTO> GetResponseDTOAndUpdateScores(TableClient matchesClient, TableClient scoresClient, int[] moves, CheckRequestDTO checkRequestDTO, ILogger log) {
      var checkResponseDTO = new CheckResponseDTO();
      if (moves.Length < 3) return checkResponseDTO;
      var permutationMoves = moves.Permutations(3).Select(p => string.Join("", p)).Distinct();
      string winningPattern = null;
      foreach (var pattern in Patterns)
      {
          winningPattern = permutationMoves.SingleOrDefault(perm => perm == pattern);
          if(winningPattern != null) break;
      }
      
      if (winningPattern != null)
      {
        checkResponseDTO.HasWon = true;
        checkResponseDTO.WinningSquares = winningPattern.Split("").Select(x => Convert.ToInt32(x) as int?).ToArray();
        await UpdateScore(scoresClient, checkRequestDTO.PlayerName, 10);
        await DeleteMatches(matchesClient, checkRequestDTO);
      }
      if (moves.Length == 5) 
      {
        checkResponseDTO.HasTie = true;
        await UpdateScore(scoresClient, checkRequestDTO.PlayerName, 5);
        await UpdateScore(scoresClient, checkRequestDTO.RivalName, 5);
        await DeleteMatches(matchesClient, checkRequestDTO);
      }
      return checkResponseDTO;
    }

    [FunctionName("check")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
        [Table("matches", Connection = "CosmosDbConnectionString")] TableClient matchesClient,
        [Table("scores", Connection = "CosmosDbConnectionString")] TableClient scoresClient,
        ILogger log)
    {
      string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var checkRequestDTO = JsonConvert.DeserializeObject<CheckRequestDTO>(requestBody);

      log.LogInformation($"{checkRequestDTO.PlayerName} moves {checkRequestDTO.Position}");

      var moves = await UpdateAndGetMoves(matchesClient, checkRequestDTO);
      var checkResponseDTO = await GetResponseDTOAndUpdateScores(matchesClient, scoresClient, moves, checkRequestDTO, log);
      return new OkObjectResult(checkResponseDTO);
    }
  }
}
