using AusOpenAnalyticsSolution.BO;
using AusOpenAnalyticsSolution.Utility;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace AusOpenAnalyticsSolution.Test
{
    [TestClass]
    public class UnitTestCoverage
    {
      
        [TestMethod]
        public void TestGetPlayerOne()
        {

            CsvRecord csvRecord = new CsvRecord();
            csvRecord.PlayerOneName = "Test1";
            csvRecord.PlayerTwoName = "Test2";
            csvRecord.PlayerOnePoint = "1";
            csvRecord.PlayerTwoPoint = "2";
            csvRecord.PlayerOneAce = "TRUE";
            csvRecord.PlayerTwoAce = "FALSE";
            csvRecord.PlayerOneGame = "1";
            csvRecord.PlayerTwoGame = "2";
            csvRecord.PlayerOneSet = "1";
            csvRecord.PlayerTwoSet = "2";
            csvRecord.PlayerOneFirstServe = "4d";
            csvRecord.PlayerOneFirstServeIn = "yes";
            csvRecord.PlayerTwoFirstServe = "4b";
            csvRecord.PlayerTwoFirstServeIn = "no";
            csvRecord.PlayerOneFirstServeShot = "4";
            csvRecord.PlayerOneSecondServeShot = "6";
            csvRecord.PlayerTwoFirstServeShot = "5";
            csvRecord.PlayerTwoSecondServeShot = "5";
            csvRecord.PlayerOneServeDirection = "L";
            csvRecord.PlayerTwoServeDirection = "";
            csvRecord.ServeDirectionDecider = "0-0";
            Match testMatch = new Match(1);
            var result = testMatch.GetPlayerOne(csvRecord, null);
            Assert.IsNotNull(result);

        }
    }
}
