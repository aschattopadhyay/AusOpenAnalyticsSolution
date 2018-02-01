using System;
using System.Collections.Generic;
using System.Text;

namespace AusOpenAnalyticsSolution.BO
{
    public class Player
    {
        

        private string name = null;
        public string Name
        {
            get
            {
                return name;
            }
            set
            {

                name = value;

            }
        }


        private string currentGame = null;
        public string CurrentGame
        {
            get
            {
                return currentGame;
            }
            set
            {

                currentGame = value;
               
            }
        }

        private int currentSet = 0;
        public int CurrentSet
        {
            get
            {
                return currentSet;
            }
            set
            {

                currentSet = value;

            }
        }

        private int totalSet = 0;
        public int TotalSet
        {
            get
            {
                return totalSet;
            }
            set
            {

                totalSet = value;

            }
        }

        private int numberOfAces = 0;
        public int NumberOfAces
        {
            get
            {
                return numberOfAces;
            }
            set
            {

                numberOfAces = value;

            }
        }

        private double percentageOfFirstServe = 0.0;
        public double PercentageOfFirstServe
        {
            get
            {
                percentageOfFirstServe = NumberOfFirstServe == 0 ? 0 : Math.Round((((double)NumberOfFirstServeIn * 100) / (double)NumberOfFirstServe), 2);
                return percentageOfFirstServe;
            }
        }

        private bool winner = false;
        public bool Winner
        {
            get
            {
                return winner;
            }
            set
            {

                winner = value;

            }
        }

        private List<double> winningChance = null;
        public List<double> WinningChance
        {
            get
            {
                return winningChance;
            }
            set
            {

                winningChance = value;

            }


        }

        private int numberOfFirstServe = 0;
        public int NumberOfFirstServe
        {
            get
            {
                return numberOfFirstServe;
            }
            set
            {

                numberOfFirstServe = value;

            }
        }

        private int numberOfFirstServeIn = 0;
        public int NumberOfFirstServeIn
        {
            get
            {
                return numberOfFirstServeIn;
            }
            set
            {

                numberOfFirstServeIn = value;

            }
        }

        private string firstServeShot = null;
        public string FirstServeShot
        {
            get
            {
                return firstServeShot;
            }
            set
            {

                firstServeShot = value;

            }
        }

        private string secondServeShot = null;
        public string SecondServeShot
        {
            get
            {
                return secondServeShot;
            }
            set
            {

                secondServeShot = value;

            }
        }

        private string serveDirection = "";
        public string ServeDirection
        {
            get
            {
                return serveDirection;
            }
            set
            {

                serveDirection = value;

            }
        }

        private int numberOfWideSecondServeFromLeft = 0;
        public int NumberOfWideSecondServeFromLeft
        {
            get
            {
                return numberOfWideSecondServeFromLeft;
            }
            set
            {

                numberOfWideSecondServeFromLeft = value;

            }
        }

        private int numberOfSecondServeFromLeft = 0;
        public int NumberOfSecondServeFromLeft
        {
            get
            {
                return numberOfSecondServeFromLeft;
            }
            set
            {

                numberOfSecondServeFromLeft = value;

            }
        }

        private double probabilityOfWideSecondServeFromLeft = 0.0;
        public double ProbabilityOfWideSecondServeFromLeft
        {
            get
            {
                probabilityOfWideSecondServeFromLeft = NumberOfSecondServeFromLeft == 0 ? 0 : Math.Round((((double)NumberOfWideSecondServeFromLeft * 100) / (double)NumberOfSecondServeFromLeft), 2);
                return probabilityOfWideSecondServeFromLeft;
            }
        }


        public Player()
        {
            winningChance = new List<double>();
        }




    }
}
