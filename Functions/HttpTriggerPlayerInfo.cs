using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Data.Tables;
using System.Linq;

namespace TicTacToe.Function
{
  public static class HttpTriggerPlayerInfo
  {
    public static async Task<int> GetUserScore(TableClient tableClient, string playerName)
    {
      await tableClient.CreateIfNotExistsAsync();
      TableEntity scoreResult = tableClient
        .Query<TableEntity>(x => x.PartitionKey == "global" && x.RowKey == playerName)
        .SingleOrDefault();

      if (scoreResult is null)
      {
        var newEntity = new TableEntity("global", playerName)
        {
            {"score", 0}
        };
        await tableClient.AddEntityAsync(newEntity);
      }

      return scoreResult?.GetInt32("score") ?? 0;
    }

    [FunctionName("player-info")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
        [Table("scores", Connection = "CosmosDbConnectionString")] TableClient tableClient,
        ILogger log)
    {
      string playerName = req.Query["playerName"];
      log.LogInformation($"{playerName} requested info");
      var score = await GetUserScore(tableClient, playerName);
      var response = new PlayerResponseDTO() { Name = playerName, Score = score };
      return new OkObjectResult(response);
    }
  }
}
