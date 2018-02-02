using System;
using System.Collections.Generic;
using System.Text;

namespace AusOpenAnalyticsSolution.Utility
{
    public static class ReadData
    {
        public static List<CsvRecord> GetCsvRecords()
        {
            List<CsvRecord> allData = new List<CsvRecord>();
            List<string> columns = new List<string>();
            string _filePath = string.Concat(System.Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "\\AusOpenApp\\2017 Australian Open Final Rafael Nadal vs Roger Federer.csv");
            using (var reader = new CsvFileReader(_filePath))
            {
                while (reader.ReadRow(columns))
                {
                    //Ignore the first row which is a header
                    if (columns[0] == "match_id")
                    {
                        continue;
                    }

                    //Assumption - match id is of the same format always
                    string matchName = columns[0];
                    string[] nameArray = matchName.Split('-');
                    string nameOne = nameArray[4];
                    nameOne = nameOne.Replace('_', ' ');
                    string nameTwo = nameArray[5];
                    nameTwo = nameTwo.Replace('_', ' ');

                    string pts = columns[38];
                    string gmw = columns[39];
                    string svr = columns[7];
                    string ptsOne = null;
                    string ptsTwo = null;
                    //split pts to get playerOne and playerTwo pts
                    if (!pts.Equals("GM"))
                    {
                        string[] ptsArray = pts.Split('-');
                        ptsOne = svr.Equals("1") ? ptsArray[0] : ptsArray[1];
                        ptsTwo = svr.Equals("2") ? ptsArray[0] : ptsArray[1];
                    }
                    else
                    {
                        ptsOne = gmw.Equals("1") ? "Game" : "0";
                        ptsTwo = gmw.Equals("2") ? "Game" : "0";

                    }
                    string isAce = columns[26];
                    string aceOne = svr.Equals("1") ? isAce : "FALSE"; 
                    string aceTwo = svr.Equals("2") ? isAce : "FALSE";
                    


                    string gmOne = columns[40];
                    string gmTwo = columns[41];
                    string setOne = columns[43];
                    string setTwo = columns[44];


                    string firstServe = columns[10];
                    string secondServe = columns[11];

                    string playerOneFirstServe = svr.Equals("1") ? firstServe : "";
                    string playerTwoFirstServe = svr.Equals("2") ? firstServe : "";

                    string playerOneFirstServeIn = svr.Equals("1") && String.IsNullOrWhiteSpace(secondServe) ? firstServe : "";
                    string playerTwoFirstServeIn = svr.Equals("2") && String.IsNullOrWhiteSpace(secondServe) ? firstServe : "";

                    //Analyse serve shots
                    string playerOneFirstServeShot = svr.Equals("1") ? firstServe.Substring(0, 2) : "";
                    string playerOneSecondServeShot = svr.Equals("1") && !String.IsNullOrWhiteSpace(secondServe) ? secondServe.Substring(0, 2) : "";

                    string playerTwoFirstServeShot = svr.Equals("2") ? firstServe.Substring(0, 2) : "";
                    string playerTwoSecondServeShot = svr.Equals("2") && !String.IsNullOrWhiteSpace(secondServe) ? secondServe.Substring(0, 2) : "";

                    string serveDirectionDecider = columns[2];
                    string playerOneServeDirection = svr.Equals("1") ? serveDirectionDecider.Equals("0-0")?"R": "" : "";
                    string playerTwoServeDirection = svr.Equals("2") ? serveDirectionDecider.Equals("0-0") ? "R" : "" : "";

                    
                    CsvRecord csvRecord = new CsvRecord();
                    csvRecord.PlayerOneName = nameOne;
                    csvRecord.PlayerTwoName = nameTwo;
                    csvRecord.PlayerOnePoint = ptsOne;
                    csvRecord.PlayerTwoPoint = ptsTwo;
                    csvRecord.PlayerOneAce = aceOne;
                    csvRecord.PlayerTwoAce = aceTwo;
                    csvRecord.PlayerOneGame = gmOne;
                    csvRecord.PlayerTwoGame = gmTwo;
                    csvRecord.PlayerOneSet = setOne;
                    csvRecord.PlayerTwoSet = setTwo;
                    csvRecord.PlayerOneFirstServe = playerOneFirstServe;
                    csvRecord.PlayerOneFirstServeIn = playerOneFirstServeIn;
                    csvRecord.PlayerTwoFirstServe = playerTwoFirstServe;
                    csvRecord.PlayerTwoFirstServeIn = playerTwoFirstServeIn;
                    csvRecord.PlayerOneFirstServeShot = playerOneFirstServeShot;
                    csvRecord.PlayerOneSecondServeShot = playerOneSecondServeShot;
                    csvRecord.PlayerTwoFirstServeShot = playerTwoFirstServeShot;
                    csvRecord.PlayerTwoSecondServeShot = playerTwoSecondServeShot;
                    csvRecord.PlayerOneServeDirection = playerOneServeDirection;
                    csvRecord.PlayerTwoServeDirection = playerTwoServeDirection;
                    csvRecord.ServeDirectionDecider = serveDirectionDecider;

                    allData.Add(csvRecord);

                }
            }


            return allData;


        }
    }
}
