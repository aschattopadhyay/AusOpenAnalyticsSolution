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
        public async Task<IActionResult> Get()
        {    

            try
            {
                Match currentMatch = new Match();

                var response = _httpContextAccessor.HttpContext.Response;
                response.Headers.Add("Content-Type", "text/event-stream");
                response.StatusCode = 200;

                Player playerOne = null;
                Player playerTwo = null;

                //Read each line of the data source and flush it every 5000 milliseconds
                for (var i = 0; i<currentMatch.NumberOfRecords; ++i)
                {

                    CsvRecord record = currentMatch.GetCsvRecordAtIndex(i);
                    //Get player one
                    playerOne = currentMatch.GetPlayerOne(record, playerOne);
                    
                    //Get player two
                    playerTwo = currentMatch.GetPlayerTwo(record, playerTwo);
                    
                    //The update for last point
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
            return Ok();
        }

    }


}
