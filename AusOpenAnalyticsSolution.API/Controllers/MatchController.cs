using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using AusOpenAnalyticsSolution.BO;
using AusOpenAnalyticsSolution.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AusOpenAnalyticsSolution.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[Controller]")]
    
    public class MatchController : Controller
    {

      
      

        private readonly IHttpContextAccessor _httpContextAccessor;
        public MatchController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public async Task Get(int id)
        {    

            try
            {
                Match currentMatch = new Match(id);

                var response = _httpContextAccessor.HttpContext.Response;
                response.Headers.Add("Content-Type", "text/event-stream");
                response.StatusCode = 200;

                Player playerOne = null;
                Player playerTwo = null;

                //Read each line of the data source and flush it every 5000 milliseconds
                for (var i = 0; i<currentMatch.NumberOfRecords; ++i)
                {

                    CsvRecord record = currentMatch.GetCsvRecordAtIndex(i);
                    int playerOneAceCounter = record.PlayerOneAce == "TRUE" ? 1 : 0;
                    int playerTwoAceCounter = record.PlayerTwoAce == "TRUE" ? 1 : 0;

                    int playerOneFirstServe = !String.IsNullOrWhiteSpace(record.PlayerOneFirstServe) ? 1 : 0;
                    int playerTwoFirstServe = !String.IsNullOrWhiteSpace(record.PlayerTwoFirstServe) ? 1 : 0;

                    int playerOneFirstServeIn = !String.IsNullOrWhiteSpace(record.PlayerOneFirstServeIn) ? 1 : 0;
                    int playerTwoFirstServeIn = !String.IsNullOrWhiteSpace(record.PlayerTwoFirstServeIn) ? 1 : 0;

                    //Decide serve direction
                    string playerOneServeDirection = record.PlayerOneServeDirection;
                    string playerTwoServeDirection = record.PlayerTwoServeDirection;


                    //Winning chance is calculated as random double between 0(inclusive) and 1. Ideally something mentioned in this link (https://pdfs.semanticscholar.org/114a/2c60da136f80c304f4ed93fa7c796cc76f28.pdf) should be implemented.
                    //Probability is always between 0 and 1.
                    double playerOneWinningChance = Math.Round(new Random().NextDouble(),2);
                    double playerTwoWinningChance = Math.Round(new Random().NextDouble(), 2);
                    

                    playerOne = currentMatch.GetPlayerOne(record, playerOne);
                    playerOne.NumberOfAces = playerOne.NumberOfAces + playerOneAceCounter;
                    playerOne.NumberOfFirstServe = playerOne.NumberOfFirstServe + playerOneFirstServe;
                    playerOne.NumberOfFirstServeIn = playerOne.NumberOfFirstServeIn + playerOneFirstServeIn;
                    playerOne.ServeDirection = String.IsNullOrWhiteSpace(playerOneServeDirection) && record.ServeDirectionDecider.Equals("0-0") ? "" : String.IsNullOrWhiteSpace(playerOneServeDirection) ? playerOne.ServeDirection.Equals("L")?"R": playerOne.ServeDirection.Equals("R") ? "L" : "" : playerOneServeDirection;
                    playerOne.NumberOfSecondServeFromLeft = String.IsNullOrWhiteSpace(playerOne.SecondServeShot) ? playerOne.NumberOfSecondServeFromLeft + 0 : playerOne.ServeDirection.Equals("L") ? playerOne.NumberOfSecondServeFromLeft + 1 : playerOne.NumberOfSecondServeFromLeft + 0;
                    playerOne.NumberOfWideSecondServeFromLeft = String.IsNullOrWhiteSpace(playerOne.SecondServeShot) ? playerOne.NumberOfWideSecondServeFromLeft + 0 : playerOne.ServeDirection.Equals("L") && playerOne.SecondServeShot.IndexOf("4") == 0 ? playerOne.NumberOfWideSecondServeFromLeft + 1 : playerOne.NumberOfWideSecondServeFromLeft + 0;
                    playerOne.WinningChance.Add(playerOneWinningChance);

                    playerTwo = currentMatch.GetPlayerTwo(record, playerTwo);
                    playerTwo.NumberOfAces = playerTwo.NumberOfAces + playerTwoAceCounter;
                    playerTwo.NumberOfFirstServe = playerTwo.NumberOfFirstServe + playerTwoFirstServe;
                    playerTwo.NumberOfFirstServeIn = playerTwo.NumberOfFirstServeIn + playerTwoFirstServeIn;
                    playerTwo.ServeDirection = String.IsNullOrWhiteSpace(playerTwoServeDirection) && record.ServeDirectionDecider.Equals("0-0") ? "" : String.IsNullOrWhiteSpace(playerTwoServeDirection) ? playerTwo.ServeDirection.Equals("L") ? "R" : playerTwo.ServeDirection.Equals("R") ? "L" : "" : playerTwoServeDirection;
                    playerTwo.NumberOfSecondServeFromLeft = String.IsNullOrWhiteSpace(playerTwo.SecondServeShot) ? playerTwo.NumberOfSecondServeFromLeft + 0 : playerTwo.ServeDirection.Equals("L") ? playerTwo.NumberOfSecondServeFromLeft + 1 : playerTwo.NumberOfSecondServeFromLeft + 0;
                    playerTwo.NumberOfWideSecondServeFromLeft = String.IsNullOrWhiteSpace(playerTwo.SecondServeShot) ? playerTwo.NumberOfWideSecondServeFromLeft + 0 : playerTwo.ServeDirection.Equals("L") && playerTwo.SecondServeShot.IndexOf("4") == 0 ? playerTwo.NumberOfWideSecondServeFromLeft + 1 : playerTwo.NumberOfWideSecondServeFromLeft + 0;
                    playerTwo.WinningChance.Add(playerTwoWinningChance);

                    if (i== currentMatch.NumberOfRecords - 1)
                    {
                        if (playerOne.TotalSet > playerTwo.TotalSet)
                        {
                            playerOne.Winner = true;
                            playerOne.WinningChance[playerOne.WinningChance.Count - 1] = 1;
                            playerTwo.WinningChance[playerTwo.WinningChance.Count - 1] = 0;
                        }
                        else
                        {
                            playerTwo.Winner = true;
                            playerTwo.WinningChance[playerTwo.WinningChance.Count - 1] = 1;
                            playerOne.WinningChance[playerOne.WinningChance.Count - 1] = 0;
                        }
                    }
                    
                    string playerOneJson = JsonConvert.SerializeObject(playerOne);
                    string playerTwoJson = JsonConvert.SerializeObject(playerTwo);



                    string data = "data: {\"Players\":["+ playerOneJson+","+ playerTwoJson+"]}\n\n";
                    //Also look for winner if it's the last record, ace calculation, 1st serve % calculation


                    await response.WriteAsync(data);

                    response.Body.Flush();

                    await Task.Delay(5 * 1000);

                }
            }
            catch (Exception ex)
            {
                //TODO: Logging of exception
                throw new Exception(ex.Message);
            }
        }

    }


}
