using AusOpenAnalyticsSolution.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace AusOpenAnalyticsSolution.BO
{
    public class Match
    {
        private int numberOfRecords = 0;
        public int NumberOfRecords
        {
            get
            {
                return numberOfRecords;
            }
            set
            {

                numberOfRecords = value;

            }
        }
        private List<CsvRecord> allData = null;



        public Match()
        {
            //Read the CSV file
            allData = ReadData.GetCsvRecords();
            this.numberOfRecords = allData.Count;

        }

        public CsvRecord GetCsvRecordAtIndex(int index)
        {
            CsvRecord record = null;
            if(index >=0 && index < allData.Count)
                record = this.allData[index];

            return record;

        }
        
        public Player GetPlayerOne(CsvRecord record, Player playerOne)
        {
            if(playerOne == null)
                playerOne = new Player();

            playerOne.Name = record.PlayerOneName;
            playerOne.CurrentGame = record.PlayerOnePoint;
            playerOne.CurrentSet = Convert.ToInt32(record.PlayerOneGame);
            playerOne.TotalSet = Convert.ToInt32(record.PlayerOneSet);
            playerOne.FirstServeShot = record.PlayerOneFirstServeShot;
            playerOne.SecondServeShot = record.PlayerOneSecondServeShot;

            int playerOneAceCounter = record.PlayerOneAce == "TRUE" ? 1 : 0;
            int playerOneFirstServe = !String.IsNullOrWhiteSpace(record.PlayerOneFirstServe) ? 1 : 0;
            int playerOneFirstServeIn = !String.IsNullOrWhiteSpace(record.PlayerOneFirstServeIn) ? 1 : 0;
            //Decide serve direction
            string playerOneServeDirection = record.PlayerOneServeDirection;
           
            //Winning chance is calculated as random double between 0(inclusive) and 1. Ideally something mentioned in this link (https://pdfs.semanticscholar.org/114a/2c60da136f80c304f4ed93fa7c796cc76f28.pdf) should be implemented.
            //Probability is always between 0 and 1.
            double playerOneWinningChance = Math.Round(new Random().NextDouble(), 2);

            //Update player one
            playerOne.NumberOfAces = playerOne.NumberOfAces + playerOneAceCounter;
            playerOne.NumberOfFirstServe = playerOne.NumberOfFirstServe + playerOneFirstServe;
            playerOne.NumberOfFirstServeIn = playerOne.NumberOfFirstServeIn + playerOneFirstServeIn;
            playerOne.ServeDirection = String.IsNullOrWhiteSpace(playerOneServeDirection) && record.ServeDirectionDecider.Equals("0-0") ? "" : String.IsNullOrWhiteSpace(playerOneServeDirection) ? playerOne.ServeDirection.Equals("L") ? "R" : playerOne.ServeDirection.Equals("R") ? "L" : "" : playerOneServeDirection;
            playerOne.NumberOfSecondServeFromLeft = String.IsNullOrWhiteSpace(playerOne.SecondServeShot) ? playerOne.NumberOfSecondServeFromLeft + 0 : playerOne.ServeDirection.Equals("L") ? playerOne.NumberOfSecondServeFromLeft + 1 : playerOne.NumberOfSecondServeFromLeft + 0;
            playerOne.NumberOfWideSecondServeFromLeft = String.IsNullOrWhiteSpace(playerOne.SecondServeShot) ? playerOne.NumberOfWideSecondServeFromLeft + 0 : playerOne.ServeDirection.Equals("L") && playerOne.SecondServeShot.IndexOf("4") == 0 ? playerOne.NumberOfWideSecondServeFromLeft + 1 : playerOne.NumberOfWideSecondServeFromLeft + 0;
            playerOne.WinningChance.Add(playerOneWinningChance);

            return playerOne;

        }

        public Player GetPlayerTwo(CsvRecord record, Player playerTwo)
        {
            if (playerTwo == null)
                playerTwo = new Player();

            playerTwo.Name = record.PlayerTwoName;
            playerTwo.CurrentGame = record.PlayerTwoPoint;
            playerTwo.CurrentSet = Convert.ToInt32(record.PlayerTwoGame);
            playerTwo.TotalSet = Convert.ToInt32(record.PlayerTwoSet);
            playerTwo.FirstServeShot = record.PlayerTwoFirstServeShot;
            playerTwo.SecondServeShot = record.PlayerTwoSecondServeShot;

            int playerTwoAceCounter = record.PlayerTwoAce == "TRUE" ? 1 : 0;

            int playerTwoFirstServe = !String.IsNullOrWhiteSpace(record.PlayerTwoFirstServe) ? 1 : 0;
            
            int playerTwoFirstServeIn = !String.IsNullOrWhiteSpace(record.PlayerTwoFirstServeIn) ? 1 : 0;

            //Decide serve direction
            string playerTwoServeDirection = record.PlayerTwoServeDirection;


            //Winning chance is calculated as random double between 0(inclusive) and 1. Ideally something mentioned in this link (https://pdfs.semanticscholar.org/114a/2c60da136f80c304f4ed93fa7c796cc76f28.pdf) should be implemented.
            //Probability is always between 0 and 1.
            double playerTwoWinningChance = Math.Round(new Random().NextDouble(), 2);
            playerTwo.NumberOfAces = playerTwo.NumberOfAces + playerTwoAceCounter;
            playerTwo.NumberOfFirstServe = playerTwo.NumberOfFirstServe + playerTwoFirstServe;
            playerTwo.NumberOfFirstServeIn = playerTwo.NumberOfFirstServeIn + playerTwoFirstServeIn;
            playerTwo.ServeDirection = String.IsNullOrWhiteSpace(playerTwoServeDirection) && record.ServeDirectionDecider.Equals("0-0") ? "" : String.IsNullOrWhiteSpace(playerTwoServeDirection) ? playerTwo.ServeDirection.Equals("L") ? "R" : playerTwo.ServeDirection.Equals("R") ? "L" : "" : playerTwoServeDirection;
            playerTwo.NumberOfSecondServeFromLeft = String.IsNullOrWhiteSpace(playerTwo.SecondServeShot) ? playerTwo.NumberOfSecondServeFromLeft + 0 : playerTwo.ServeDirection.Equals("L") ? playerTwo.NumberOfSecondServeFromLeft + 1 : playerTwo.NumberOfSecondServeFromLeft + 0;
            playerTwo.NumberOfWideSecondServeFromLeft = String.IsNullOrWhiteSpace(playerTwo.SecondServeShot) ? playerTwo.NumberOfWideSecondServeFromLeft + 0 : playerTwo.ServeDirection.Equals("L") && playerTwo.SecondServeShot.IndexOf("4") == 0 ? playerTwo.NumberOfWideSecondServeFromLeft + 1 : playerTwo.NumberOfWideSecondServeFromLeft + 0;
            playerTwo.WinningChance.Add(playerTwoWinningChance);

            return playerTwo;

        }



    }
}
