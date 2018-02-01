$(document).ready(function () {

    var source = null;

    if (!window.EventSource) {
        alert("Your browser does not support EventSource (IE/Edge?), please use a browser with EventSource support (see http://caniuse.com/#search=EventSource). Else you will experience difficulty in using the application");
        return;
    }

    //Hide the visualisation dropdown on load
    $('#divVisualisation').hide();
    $('#divVisualisationDisplay').hide();
    //Show visualisation dropdown on selection of a match
    $('#ddlMatch').on('change', function () {
        if (this.value != 'Select') {
            if (source != null)
                source.close();
            if (this.value == '2017Final') {
                $('#divVisualisation').show();
            }
            else {
                $.notify(
                    "The match hasn't started! Please try at the schedule time to see live analysis.", {
                        className: 'error',
                        clickToHide: true,
                        autoHide: true,
                        globalPosition: 'top center'
                    });
                $('#ddlVisualisation').val('Select');
                if (source != null)
                    source.close();
                $('#divVisualisation').hide();
                $('#divVisualisationDisplay').html('');
                d3.select("svg").remove();
                $('#divVisualisationDisplay').hide();
            }

        }
        else {
            $('#ddlVisualisation').val('Select');
            if (source != null)
                source.close();
            $('#divVisualisation').hide();
            $('#divVisualisationDisplay').html('');
            d3.select("svg").remove();
            $('#divVisualisationDisplay').hide();
        }
    })

    //Show display on selection of appropriate chart
    $('#ddlVisualisation').on('change', function () {
        if (this.value != 'Select') {
            if (source != null)
                source.close();
            $('#divVisualisation').hide();
            $('#divVisualisationDisplay').html('');
            d3.select("svg").remove();
            $('#divVisualisationDisplay').hide();

            if (this.value == 'Game') {
                $('#divVisualisation').show();
                $('#divVisualisationDisplay').show();

                //Get all the data
                source = new EventSource('http://localhost:3703/api/match?id=1');
                source.onmessage = function (event) {
                    var data = JSON.parse(event.data);

                    var playerOneName = data.Players[0].Name;
                    var playerTwoName = data.Players[1].Name;

                    var playerOneCurrentGame = data.Players[0].CurrentGame;
                    var playerTwoCurrentGame = data.Players[1].CurrentGame;

                    var playerOneCurrentSet = data.Players[0].CurrentSet;
                    var playerTwoCurrentSet = data.Players[1].CurrentSet;

                    var playerOneTotalSet = data.Players[0].TotalSet;
                    var playerTwoTotalSet = data.Players[1].TotalSet;

                    var playerOneAce = data.Players[0].NumberOfAces;
                    var playerTwoAce = data.Players[1].NumberOfAces;

                    var playerOneWinner = data.Players[0].Winner;
                    var playerTwoWinner = data.Players[1].Winner;

                    var winningPlayer = playerOneWinner == true ? playerOneName : playerTwoWinner == true ? playerTwoName : '';

                    //console.log(playerOneAce, playerTwoAce);

                    $('#divVisualisationDisplay').html('');
                    d3.select("svg").remove();

                    var currentGameDiv = "<div style='margin-top:10px;' id='currentGame'><div><b>Game In Progress</b></div><div><b>" + playerOneName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerOneCurrentGame + "</span><br/><b>" + playerTwoName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerTwoCurrentGame + "</span></div></div>";
                    $('#divVisualisationDisplay').append(currentGameDiv);

                    //Plot current set in terms of number of games
                    var dataset;

                    dataset = [
                        { CurrentSet: playerOneCurrentSet, Player: playerOneName },
                        { CurrentSet: playerTwoCurrentSet, Player: playerTwoName }
                    ]
                    displayCurrentSet(dataset)
                    $('#divVisualisationDisplay').append("<div style='margin- top:10px;padding-bottom:30px;text-align:center;width:800px;'><b>Number of Sets Won in Current Match</b></div>");

                    //Legend forpie chart
                    if (playerOneTotalSet != 0 || playerTwoTotalSet != 0)
                        $('#divVisualisationDisplay').append("<div style='margin- top:10px;padding-bottom:30px;text-align:right;width:800px;'><div style='background-color:#b23738;width:15%;text-align:center;float:right;font-size:15px;color:white;'>Rafael Nadal</div><div style='background-color:#efb7b6;font-size:15px;width:15%;text-align:center;float:right;'>Roger Federer</div></div>");

                    var dataset = [
                        { "label": playerOneName, "value": playerOneTotalSet },
                        { "label": playerTwoName, "value": playerTwoTotalSet }
                    ];

                    displayTotalSet(dataset)


                    $('#divVisualisationDisplay').show();

                    if (winningPlayer) {

                        $.notify(
                            "Congratulations " + winningPlayer + ", the winner", {
                                className: 'success',
                                clickToHide: true,
                                autoHide: true,
                                globalPosition: 'top center'
                            });

                    }


                };

                source.onopen = function (event) {
                    console.log('onopen');
                };

                source.onerror = function (event) {
                    console.log('End of match');
                    source.close();
                };

            }
            else if (this.value == '1st Serve Percentage') {
                $('#divVisualisation').show();
                $('#divVisualisationDisplay').show();
                //Get all the data
                source = new EventSource('http://localhost:3703/api/match?id=1');
                source.onmessage = function (event) {
                    var data = JSON.parse(event.data);

                    var playerOneName = data.Players[0].Name;
                    var playerTwoName = data.Players[1].Name;

                    var playerOneFirstServePercentage = data.Players[0].PercentageOfFirstServe;
                    var playerTwoFirstServePercentage = data.Players[1].PercentageOfFirstServe;

                    var playerOneCurrentGame = data.Players[0].CurrentGame;
                    var playerTwoCurrentGame = data.Players[1].CurrentGame;

                    var playerOneWinner = data.Players[0].Winner;
                    var playerTwoWinner = data.Players[1].Winner;

                    var winningPlayer = playerOneWinner == true ? playerOneName : playerTwoWinner == true ? playerTwoName : '';

                    //console.log(playerOneAce, playerTwoAce);

                    $('#divVisualisationDisplay').html('');
                    d3.select("svg").remove();

                    var currentGameDiv = "<div style='margin-top:10px;' id='currentGame'><div><b>Game In Progress</b></div><div><b>" + playerOneName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerOneCurrentGame + "</span><br/><b>" + playerTwoName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerTwoCurrentGame + "</span></div></div>";
                    $('#divVisualisationDisplay').append(currentGameDiv);

                    //Plot current set in terms of number of games
                    var dataset;

                    dataset = [
                        { CurrentSet: playerOneFirstServePercentage, Player: playerOneName },
                        { CurrentSet: playerTwoFirstServePercentage, Player: playerTwoName }
                    ]
                    displayFirstServePercentage(dataset);
                    $('#divVisualisationDisplay').show();

                    if (winningPlayer) {

                        $.notify(
                            "Congratulations " + winningPlayer + ", the winner", {
                                className: 'success',
                                clickToHide: true,
                                autoHide: true,
                                globalPosition: 'top center'
                            });

                    }
                };

                source.onopen = function (event) {
                    console.log('onopen');
                };

                source.onerror = function (event) {
                    console.log('End of match');
                    source.close();
                };



            }
            else if (this.value == 'Match Prediction') {

                //This piece implements a dummy mathematical calculation, for the purpose of POC. Ideally something mentioned in this link (https://pdfs.semanticscholar.org/114a/2c60da136f80c304f4ed93fa7c796cc76f28.pdf) should be implemented.
                $('#divVisualisation').show();
                $('#divVisualisationDisplay').show();
                //Get all the data
                source = new EventSource('http://localhost:3703/api/match?id=2');
                source.onmessage = function (event) {
                    var data = JSON.parse(event.data);

                    var playerOneName = data.Players[0].Name;
                    var playerTwoName = data.Players[1].Name;

                    var playerOneWinner = data.Players[0].Winner;
                    var playerTwoWinner = data.Players[1].Winner;

                    var winningPlayer = playerOneWinner == true ? playerOneName : playerTwoWinner == true ? playerTwoName : '';

                    var playerOneWinningChance = data.Players[0].WinningChance;
                    var playerTwoWinningChance = data.Players[1].WinningChance;

                    var playerOnedata = [];
                    var playerTwodata = [];

                    for (var i = 0; i < playerOneWinningChance.length; i++) {

                        playerOnedata.push({ "probability": playerOneWinningChance[i], "point": (i + 1) });
                        playerTwodata.push({ "probability": playerTwoWinningChance[i], "point": (i + 1) });

                    }

                    var chartConfig1 = { data: playerOnedata };
                    var chartConfig2 = { data: playerTwodata };



                    $('#divVisualisationDisplay').html('');
                    d3.select("svg").remove();
                    $('#divVisualisationDisplay').append("<div style='padding-top:20px;text-align:right;'><div style='background-color:#b23738;width:15%;text-align:center;float:right;font-size:15px;color:white;'>Rafael Nadal</div><div style='background-color:#efb7b6;font-size:15px;width:15%;text-align:center;float:right;color:black'>Roger Federer</div></div>");
                    displayMatchWinningPrediction(chartConfig1, chartConfig2);
                    if (winningPlayer) {

                        $.notify(
                            "Congratulations " + winningPlayer + ", the winner", {
                                className: 'success',
                                clickToHide: true,
                                autoHide: true,
                                globalPosition: 'top center'
                            });

                    }

                };

                source.onopen = function (event) {
                    console.log('onopen');
                };

                source.onerror = function (event) {
                    console.log('End of match');
                    source.close();
                };


            }
            else if (this.value == '1st/2nd Serve On court Shot Pattern') {
                $('#divVisualisation').show();
                $('#divVisualisationDisplay').show();
                //Get all the data
                source = new EventSource('http://localhost:3703/api/match?id=3');

                source.onmessage = function (event) {
                    var data = JSON.parse(event.data);

                    var playerOneName = data.Players[0].Name;
                    var playerTwoName = data.Players[1].Name;

                    var playerOneWinner = data.Players[0].Winner;
                    var playerTwoWinner = data.Players[1].Winner;

                    var winningPlayer = playerOneWinner == true ? playerOneName : playerTwoWinner == true ? playerTwoName : '';

                    //GET SHOT PATTERN DATA

                    $('#divVisualisationDisplay').html('');
                    d3.select("svg").remove();
                    $('#divVisualisationDisplay').append("<div style='padding-top:20px;text-align:right;padding-bottom:30px;'><div style='background-color:#b23738;width:15%;text-align:center;float:right;font-size:15px;color:white;'>Rafael Nadal</div><div style='background-color:#efb7b6;font-size:15px;width:15%;text-align:center;float:right;color:black'>Roger Federer</div></div>");
                    displayOnCourtShotPattern(data.Players[0], data.Players[1]);
                    if (winningPlayer) {

                        $.notify(
                            "Congratulations " + winningPlayer + ", the winner", {
                                className: 'success',
                                clickToHide: true,
                                autoHide: true,
                                globalPosition: 'top center'
                            });

                    }

                };

                source.onopen = function (event) {
                    console.log('onopen');
                };

                source.onerror = function (event) {
                    console.log('End of match');
                    source.close();
                };



            }
            else if (this.value == 'Number of Aces') {
                $('#divVisualisation').show();
                $('#divVisualisationDisplay').show();
                //Get all the data
                source = new EventSource('http://localhost:3703/api/match?id=1');
                source.onmessage = function (event) {
                    var data = JSON.parse(event.data);

                    var playerOneName = data.Players[0].Name;
                    var playerTwoName = data.Players[1].Name;

                    var playerOneCurrentGame = data.Players[0].CurrentGame;
                    var playerTwoCurrentGame = data.Players[1].CurrentGame;

                    var playerOneCurrentSet = data.Players[0].CurrentSet;
                    var playerTwoCurrentSet = data.Players[1].CurrentSet;

                    var playerOneTotalSet = data.Players[0].TotalSet;
                    var playerTwoTotalSet = data.Players[1].TotalSet;

                    var playerOneAce = data.Players[0].NumberOfAces;
                    var playerTwoAce = data.Players[1].NumberOfAces;

                    var playerOneWinner = data.Players[0].Winner;
                    var playerTwoWinner = data.Players[1].Winner;

                    var winningPlayer = playerOneWinner == true ? playerOneName : playerTwoWinner == true ? playerTwoName : '';

                    var playOneAces = data.Players[0].NumberOfAces;
                    var playTwoAces = data.Players[1].NumberOfAces;

                    var data = [{
                        "name": "Roger Federer",
                        "value": playTwoAces,
                    },
                    {
                        "name": "Rafael Nadal",
                        "value": playOneAces,
                    }];

                    $('#divVisualisationDisplay').html('');
                    d3.select("svg").remove();
                    var currentGameDiv = "<div style='margin-top:10px;' id='currentGame'><div><b>Game In Progress</b></div><div><b>" + playerOneName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerOneCurrentGame + "</span><br/><b>" + playerTwoName + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerTwoCurrentGame + "</span></div></div>";
                    $('#divVisualisationDisplay').append(currentGameDiv);


                    $('#divVisualisationDisplay').append("<div style='margin-top:30px;text-align:center;width:800px;'><b>Number of Aces</b></div>");
                    displayNumberOfAces(data);

                    if (winningPlayer) {

                        $.notify(
                            "Congratulations " + winningPlayer + ", the winner", {
                                className: 'success',
                                clickToHide: true,
                                autoHide: true,
                                globalPosition: 'top center'
                            });

                    }

                };

                source.onopen = function (event) {
                    console.log('onopen');
                };

                source.onerror = function (event) {
                    console.log('End of match');
                    source.close();
                };


            }
        }
        else {
            if (source != null)
                source.close();

            $('#divVisualisationDisplay').html('');
            d3.select("svg").remove();
            $('#divVisualisationDisplay').hide();

        }
    })


});

function displayCurrentSet(dataset) {
    // Call function
    Graph(dataset);


    // Create function
    function Graph(input) {

        // Declare Variables
        var margin = { top: 60, right: 60, bottom: 60, left: 120 },
            w = 800 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom;

        //Create X Scale for bar graph
        var xScale = d3.scale.ordinal()
            .domain(input.map(function (d) { return d.Player; }))
            .rangeRoundBands([0, w], 0.05);

        //Create Y Scale for bar graph
        var yScale = d3.scale.linear()
            .domain([0, d3.max(input, function (d) { return d.CurrentSet; })])
            .range([h, 0]);

        //Create X Axis	
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        //Create Y Axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        //Create SVG element
        var svg = d3.select("#divVisualisationDisplay")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Create X axis	
        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

        //Create Title 
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", -35)
            .attr("text-anchor", "middle")
            .style('font-weight', 'bold')
            .text("Number of Games Won in Current Set");

        //Create X axis label   
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", h + margin.bottom - 20)
            .style("text-anchor", "middle")
            .text("Player");

        //Create Y axis
        svg.append("g")
            .attr("class", "axis y")
            .call(yAxis);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Games");

        //Add rectangles
        svg.selectAll(".bar")
            .data(input)
            .enter()
            .append("rect")
            .attr("class", "bar")
            //.style("fill", "#0090d4")
            .style("fill", function (d) { return d.Player == 'Rafael Nadal' ? "#b23738" : "#efb7b6" })
            .attr("x", function (d) { return xScale(d.Player); })
            .attr("y", function (d) { return yScale(d.CurrentSet) })
            .attr("width", xScale.rangeBand()) //returns rangeRoundBands width
            .attr("height", function (d) { return h - yScale(d.CurrentSet) });

        svg.selectAll("text.bar")
            .data(dataset)
            .enter().append("text")
            .attr("class", "bar")
            .attr("text-anchor", "middle")
            .attr("x", function (d) { return xScale(d.Player) + xScale.rangeBand() / 2; })
            .attr("y", function (d) { return yScale(d.CurrentSet) - 10; })
            .text(function (d) { return d.CurrentSet; });

    }; // end Graph function



}

function displayFirstServePercentage(dataset) {
    // Call function
    Graph(dataset);


    // Create function
    function Graph(input) {

        // Declare Variables
        var margin = { top: 60, right: 60, bottom: 60, left: 120 },
            w = 800 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom;

        //Create X Scale for bar graph
        var xScale = d3.scale.ordinal()
            .domain(input.map(function (d) { return d.Player; }))
            .rangeRoundBands([0, w], 0.05);

        //Create Y Scale for bar graph
        var yScale = d3.scale.linear()
            .domain([0, d3.max(input, function (d) { return d.CurrentSet; })])
            .range([h, 0]);

        //Create X Axis	
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        //Create Y Axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        //Create SVG element
        var svg = d3.select("#divVisualisationDisplay")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Create X axis	
        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

        //Create Title 
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", -35)
            .attr("text-anchor", "middle")
            .style('font-weight', 'bold')
            .text("1st Serve Percentage");

        //Create X axis label   
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", h + margin.bottom - 20)
            .style("text-anchor", "middle")
            .text("Player");

        //Create Y axis
        svg.append("g")
            .attr("class", "axis y")
            .call(yAxis);

        //Create Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Percentage");

        //Add rectangles
        svg.selectAll(".bar")
            .data(input)
            .enter()
            .append("rect")
            .attr("class", "bar")
            //.style("fill", "#0090d4")
            .style("fill", function (d) { return d.Player == 'Rafael Nadal' ? "#b23738" : "#efb7b6" })
            .attr("x", function (d) { return xScale(d.Player); })
            .attr("y", function (d) { return yScale(d.CurrentSet) })
            .attr("width", xScale.rangeBand()) //returns rangeRoundBands width
            .attr("height", function (d) { return h - yScale(d.CurrentSet) });

        svg.selectAll("text.bar")
            .data(dataset)
            .enter().append("text")
            .attr("class", "bar")
            .attr("text-anchor", "middle")
            .attr("x", function (d) { return xScale(d.Player) + xScale.rangeBand() / 2; })
            .attr("y", function (d) { return yScale(d.CurrentSet) - 10; })
            .text(function (d) { return d.CurrentSet; });

    }; // end Graph function



}

function displayTotalSet(dataset) {

    var margin = { top: 60, right: 60, bottom: 60, left: 120 }
    var w = 800;
    var h = 300;
    var r = h / 2;
    var labelr = r + 30;
    var margin = { top: 150, right: 60, bottom: 60, left: 400 };
    var aColor = [
        'rgb(178, 55, 56)',
        'rgb(239, 183, 182)'
    ]

    var vis = d3.select('#divVisualisationDisplay').append("svg:svg").data([dataset]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var pie = d3.layout.pie().value(function (d) { return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function (d, i) { return aColor[i]; })
        .attr("d", function (d) { return arc(d); })
        ;

    // Add the text
    arcs.append("svg:text")
        .attr("transform", function (d) {
            d.innerRadius = 20; /* Distance of label to the center*/
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }
        )
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text(function (d, i) {
            return dataset[i].value;

        });


}

function displayMatchWinningPrediction(chartConfig1, chartConfig2) {

    var margin = { top: 60, right: 60, bottom: 60, left: 50 };
    // enviornment setup
    var svgConfig = {
        id: "mySvg",
        width: 1200 - margin.left - margin.right,
        height: 500 - margin.top - margin.bottom

    };

    // drawing
    // append svg element
    var bodySelection = d3.select("#divVisualisationDisplay");

    var svgSelection = bodySelection.append("svg")
        .attr("width", svgConfig.width + margin.left + margin.right)
        .attr("height", svgConfig.height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create x scale
    xScale = d3.scale.linear()
        .range([margin.left, svgConfig.width - margin.right])
        .domain([d3.min(chartConfig1.data, function (d) { return +d.point; }), d3.max(chartConfig1.data, function (d) { return +d.point; })]);

    // create y scale
    yScale = d3.scale.linear()
        .range([svgConfig.height - margin.top, margin.bottom])
        .domain([d3.min(chartConfig1.data, function (d) { return 0; }), d3.max(chartConfig1.data, function (d) { return 1; })]);

    //let's create the axes using the scales
    xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(d3.format("d"))
        .innerTickSize(-svgConfig.height);

    yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale)
        .innerTickSize(-svgConfig.width);

    // add xaxis to chart - it will add it to top of the svg
    svgSelection.append("svg:g")
        .attr("id", "xAxis")
        .attr("class", "axis")
        .call(xAxis);

    // The X axis is drawn but it has some issues. First, we need to position it vertically downwards using transform property
    d3.select("#xAxis")
        .attr("transform", "translate(0," + (svgConfig.height - margin.bottom) + ")");

    // add yaxis to chart, but this will not add it to correct oorientation
    svgSelection.append("svg:g")
        .attr("id", "yAxis")
        .attr("class", "axis")
        .call(yAxis);

    // apply transform logic to bring it to correct place
    d3.select("#yAxis")
        .attr("transform", "translate(" + (margin.left) + ",0)")

    // now lets generate line
    var lineSelection = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
            return xScale(d.point);
        })
        .y(function (d) {
            return yScale(d.probability)
        });

    // append line to svg
    svgSelection.append("svg:path")
        .attr('d', lineSelection(chartConfig1.data))
        .attr('stroke', '#b23738')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    svgSelection.append("svg:path")
        .attr('d', lineSelection(chartConfig2.data))
        .attr('stroke', '#efb7b6')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    //Create Title 
    svgSelection.append("text")
        .attr("x", svgConfig.width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style('font-weight', 'bold')
        .text("Match Winning Prediction");

    //Create X axis label   
    svgSelection.append("text")
        .attr("x", svgConfig.width / 2)
        .attr("y", svgConfig.height + margin.bottom - 60)
        .style("text-anchor", "middle")
        .text("Points");

    //Create Y axis label
    svgSelection.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("x", 0 - margin.left - 120)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Probability of Winning");

}

function displayNumberOfAces(data) {

    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 15,
        right: 25,
        bottom: 15,
        left: 100
    };

    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#divVisualisationDisplay").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function (d) {
            return d.name;
        }));

    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .style("padding-right", "10px")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .style("fill", function (d) { return d.name == 'Rafael Nadal' ? "#b23738" : "#efb7b6" })
        .attr("height", y.rangeBand() - 40)
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.rangeBand() / 2 + 5;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .style("font-size", "16px")
        .text(function (d) {
            return d.value;
        });



}

function displayOnCourtShotPattern(playerOne, playerTwo) {

    //First draw the tennis court
    $('#divVisualisationDisplay')
        .append('<div id="divCourt"><svg id="svgCourt" height="400" width="1140" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        '<rect x="0" y="10" height="400" width="1140" style="fill: #0090d4" />' +
        //Middle vertical line
        '<line x1="570" y1="10" x2="570" y2="410" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        //Two horizontal side lines
        '<line x1="0" y1="60" x2="1140" y2="60" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        '<line x1="0" y1="350" x2="1140" y2="350" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        //Two vertical lines - left and right court
        '<line x1="257" y1="60" x2="257" y2="350" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        '<line x1="883" y1="60" x2="883" y2="350" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        '<line x1="257" y1="205" x2="883" y2="205" style="stroke:#FFFFFF;stroke-width: 2;" />' +
        '</svg ></div >');

    var currentGameDiv = "<div style='margin-top:10px;' id='currentGame'><div><b>Probability of Wide on 2nd Serve from Left</b></div><div><b>" + playerOne.Name + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerOne.ProbabilityOfWideSecondServeFromLeft + "%</span><br/><b>" + playerTwo.Name + ":</b> <span style='font-weight:bold;color:#0090d4;'>" + playerTwo.ProbabilityOfWideSecondServeFromLeft + "%</span></div></div>";
    $('#divVisualisationDisplay').append(currentGameDiv);

    //Player one is the server
    if (playerOne.ServeDirection) {

        if (playerOne.ServeDirection === 'L') {

            var firstServeShot = playerOne.FirstServeShot;
            var secondServerShot = playerOne.SecondServeShot;
            //Plot first serve
            if (firstServeShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 132.5, '#b23738');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (firstServeShot.charAt(1) === 'w' || firstServeShot.charAt(1) === 'd' || firstServeShot.charAt(1) === 'x' || firstServeShot.charAt(1) === 'g' || firstServeShot.charAt(1) === '!' || firstServeShot.charAt(1) === 'e' || firstServeShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }

            if (firstServeShot.charAt(1) != 'w' && firstServeShot.charAt(1) != 'd' && firstServeShot.charAt(1) != 'x' && firstServeShot.charAt(1) != 'g' && firstServeShot.charAt(1) != '!' && firstServeShot.charAt(1) != 'e' && firstServeShot.charAt(1) != 'V' && firstServeShot.charAt(1) != 'n') {
                if (firstServeShot.charAt(0) === '4') {
                    appendSvgElement(300, 75, '#b23738');
                }
                if (firstServeShot.charAt(0) === '5') {
                    appendSvgElement(300, 132.5, '#b23738');
                }
                if (firstServeShot.charAt(0) === '6') {
                    appendSvgElement(300, 190, '#b23738');
                }
            }

            //Plot second serve
            if (secondServerShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 132.5, '#b23738');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) === 'w' || secondServerShot.charAt(1) === 'd' || secondServerShot.charAt(1) === 'x' || secondServerShot.charAt(1) === 'g' || secondServerShot.charAt(1) === '!' || secondServerShot.charAt(1) === 'e' || secondServerShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) != 'w' && secondServerShot.charAt(1) != 'd' && secondServerShot.charAt(1) != 'x' && secondServerShot.charAt(1) != 'g' && secondServerShot.charAt(1) != '!' && secondServerShot.charAt(1) != 'e' && secondServerShot.charAt(1) != 'V' && secondServerShot.charAt(1) != 'n') {
                if (secondServerShot.charAt(0) === '4') {
                    appendSvgElement(300, 75, '#b23738');
                }
                if (secondServerShot.charAt(0) === '5') {
                    appendSvgElement(300, 132.5, '#b23738');
                }
                if (secondServerShot.charAt(0) === '6') {
                    appendSvgElement(300, 190, '#b23738');
                }
            }

        }
        else { //has to be R

            var firstServeShot = playerOne.FirstServeShot;
            var secondServerShot = playerOne.SecondServeShot;
            //Plot first serve
            if (firstServeShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 277.5, '#b23738');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (firstServeShot.charAt(1) === 'w' || firstServeShot.charAt(1) === 'd' || firstServeShot.charAt(1) === 'x' || firstServeShot.charAt(1) === 'g' || firstServeShot.charAt(1) === '!' || firstServeShot.charAt(1) === 'e' || firstServeShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }

            if (firstServeShot.charAt(1) != 'w' && firstServeShot.charAt(1) != 'd' && firstServeShot.charAt(1) != 'x' && firstServeShot.charAt(1) != 'g' && firstServeShot.charAt(1) != '!' && firstServeShot.charAt(1) != 'e' && firstServeShot.charAt(1) != 'V' && firstServeShot.charAt(1) != 'n') {
                if (firstServeShot.charAt(0) === '4') {
                    appendSvgElement(300, 335, '#b23738');
                }
                if (firstServeShot.charAt(0) === '5') {
                    appendSvgElement(300, 277.5, '#b23738');
                }
                if (firstServeShot.charAt(0) === '6') {
                    appendSvgElement(300, 220, '#b23738');
                }
            }

            //Plot second serve
            if (secondServerShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 277.5, '#b23738');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) === 'w' || secondServerShot.charAt(1) === 'd' || secondServerShot.charAt(1) === 'x' || secondServerShot.charAt(1) === 'g' || secondServerShot.charAt(1) === '!' || secondServerShot.charAt(1) === 'e' || secondServerShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }


            if (secondServerShot.charAt(1) != 'w' && secondServerShot.charAt(1) != 'd' && secondServerShot.charAt(1) != 'x' && secondServerShot.charAt(1) != 'g' && secondServerShot.charAt(1) != '!' && secondServerShot.charAt(1) != 'e' && secondServerShot.charAt(1) != 'V' && secondServerShot.charAt(1) != 'n') {
                if (secondServerShot.charAt(0) === '4') {
                    appendSvgElement(300, 335, '#b23738');
                }
                if (secondServerShot.charAt(0) === '5') {
                    appendSvgElement(300, 277.5, '#b23738');
                }
                if (secondServerShot.charAt(0) === '6') {
                    appendSvgElement(300, 220, '#b23738');
                }
            }
        }

    }

    if (playerTwo.ServeDirection) {

        if (playerTwo.ServeDirection === 'R') {

            var firstServeShot = playerTwo.FirstServeShot;
            var secondServerShot = playerTwo.SecondServeShot;
            //Plot first serve
            if (firstServeShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 120, '#efb7b6');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (firstServeShot.charAt(1) === 'w' || firstServeShot.charAt(1) === 'd' || firstServeShot.charAt(1) === 'x' || firstServeShot.charAt(1) === 'g' || firstServeShot.charAt(1) === '!' || firstServeShot.charAt(1) === 'e' || firstServeShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }
            if (firstServeShot.charAt(1) != 'w' && firstServeShot.charAt(1) != 'd' && firstServeShot.charAt(1) != 'x' && firstServeShot.charAt(1) != 'g' && firstServeShot.charAt(1) != '!' && firstServeShot.charAt(1) != 'e' && firstServeShot.charAt(1) != 'V' && firstServeShot.charAt(1) != 'n') {
                if (firstServeShot.charAt(0) === '4') {
                    appendSvgElement(840, 75, '#efb7b6');
                }
                if (firstServeShot.charAt(0) === '5') {
                    appendSvgElement(840, 132.5, '#efb7b6');
                }
                if (firstServeShot.charAt(0) === '6') {
                    appendSvgElement(840, 190, '#efb7b6');
                }
            }

            //Plot second serve
            if (secondServerShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 120, '#efb7b6');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) === 'w' || secondServerShot.charAt(1) === 'd' || secondServerShot.charAt(1) === 'x' || secondServerShot.charAt(1) === 'g' || secondServerShot.charAt(1) === '!' || secondServerShot.charAt(1) === 'e' || secondServerShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) != 'w' && secondServerShot.charAt(1) != 'd' && secondServerShot.charAt(1) != 'x' && secondServerShot.charAt(1) != 'g' && secondServerShot.charAt(1) != '!' && secondServerShot.charAt(1) != 'e' && secondServerShot.charAt(1) != 'V' && secondServerShot.charAt(1) != 'n') {
                if (secondServerShot.charAt(0) === '4') {
                    appendSvgElement(840, 75, '#efb7b6');
                }
                if (secondServerShot.charAt(0) === '5') {
                    appendSvgElement(840, 132.5, '#efb7b6');
                }
                if (secondServerShot.charAt(0) === '6') {
                    appendSvgElement(840, 190, '#efb7b6');
                }
            }

        }
        else { //has to be L

            var firstServeShot = playerTwo.FirstServeShot;
            var secondServerShot = playerTwo.SecondServeShot;
            //Plot first serve
            if (firstServeShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 265, '#efb7b6');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (firstServeShot.charAt(1) === 'w' || firstServeShot.charAt(1) === 'd' || firstServeShot.charAt(1) === 'x' || firstServeShot.charAt(1) === 'g' || firstServeShot.charAt(1) === '!' || firstServeShot.charAt(1) === 'e' || firstServeShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }

            if (firstServeShot.charAt(1) != 'w' && firstServeShot.charAt(1) != 'd' && firstServeShot.charAt(1) != 'x' && firstServeShot.charAt(1) != 'g' && firstServeShot.charAt(1) != '!' && firstServeShot.charAt(1) != 'e' && firstServeShot.charAt(1) != 'V' && firstServeShot.charAt(1) != 'n') {
                if (firstServeShot.charAt(0) === '4') {
                    appendSvgElement(840, 335, '#efb7b6');
                }
                if (firstServeShot.charAt(0) === '5') {
                    appendSvgElement(840, 277.5, '#efb7b6');
                }
                if (firstServeShot.charAt(0) === '6') {
                    appendSvgElement(840, 220, '#efb7b6');
                }
            }

            //Plot second serve
            if (secondServerShot.charAt(1) === 'n') {
                //net faults (shown as generic, without direction)
                appendSvgElement(570, 265, '#efb7b6');
                $("#divCourt").notify(
                    "Net fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) === 'w' || secondServerShot.charAt(1) === 'd' || secondServerShot.charAt(1) === 'x' || secondServerShot.charAt(1) === 'g' || secondServerShot.charAt(1) === '!' || secondServerShot.charAt(1) === 'e' || secondServerShot.charAt(1) === 'V') {
                $("#divCourt").notify(
                    "Serve fault!",
                    { position: "top center" }
                );
            }
            if (secondServerShot.charAt(1) != 'w' && secondServerShot.charAt(1) != 'd' && secondServerShot.charAt(1) != 'x' && secondServerShot.charAt(1) != 'g' && secondServerShot.charAt(1) != '!' && secondServerShot.charAt(1) != 'e' && secondServerShot.charAt(1) != 'V' && secondServerShot.charAt(1) != 'n') {
                if (secondServerShot.charAt(0) === '4') {
                    appendSvgElement(840, 335, '#efb7b6');
                }
                if (secondServerShot.charAt(0) === '5') {
                    appendSvgElement(840, 277.5, '#efb7b6');
                }
                if (secondServerShot.charAt(0) === '6') {
                    appendSvgElement(840, 220, '#efb7b6');
                }
            }
        }

    }

}

function appendSvgElement(x, y, color) {

    var svg = document.getElementsByTagName('svg')[0]; //Get svg element
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a circle in SVG's namespace
    newElement.setAttribute("cx", x);
    newElement.setAttribute("cy", y);
    newElement.setAttribute("r", "10");
    newElement.style.fill = color;
    svg.appendChild(newElement);

}
