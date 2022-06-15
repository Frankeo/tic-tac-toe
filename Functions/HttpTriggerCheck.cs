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

    [FunctionName("check")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
        [Table("matches", Connection = "CosmosDbConnectionString")] TableClient tableClient,
        ILogger log)
    {
      string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var checkRequestDTO = JsonConvert.DeserializeObject<CheckRequestDTO>(requestBody);
      log.LogInformation($"{checkRequestDTO.PlayerName} moves {checkRequestDTO.Position}");
      var moves = await UpdateAndGetMoves(tableClient, checkRequestDTO);
      Array.Sort(moves);
      var orderedMoves = string.Join("", moves);
      log.LogInformation(orderedMoves);
      var winningPattern = Patterns.SingleOrDefault(pattern => orderedMoves.Contains(pattern));
      var checkResponseDTO = new CheckResponseDTO();
      if (winningPattern != null)
      {
        checkResponseDTO.HasWon = true;
        checkResponseDTO.WinningSquares = winningPattern.Split("").Select(x => Convert.ToInt32(x) as int?).ToArray();
      }
      if (orderedMoves.Length == 5) checkResponseDTO.HasTie = true;
      return new OkObjectResult(checkResponseDTO);
    }
  }
}
