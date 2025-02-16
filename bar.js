function Bar(layout,title,xAxis,yAxis,margin)
{

    var layout = layout;
    var title = title;
    var xAxisLabel = xAxis;
    var yAxisLabel = yAxis;
    //Statistics value for the mouseOver function
    var death_people = 0;
    var birth_people = 0;
    var populations = 0;
    var years = 0;

    this.draw = function(year,death,birth, population,type_of_data)
    {
        //declaring variables from life-death-analysis.js
        var year = year;
        var death = death;
        var birth = birth;
        var population = population;
        var type_of_data = type_of_data;
        //setup values for the bar graph drawings
        var startyear = year[0];
        var endyear = year[year.length -1];
        var mindeath = min(death);
        var maxdeath = max(death);
        var minbirth = min(birth);
        var maxbirth = max(birth);
        var minpop = min(population);
        var maxpop = max(population);

        //draw title function 
        drawTitle();
        //a description for viewers to explain the bar graph's data visualisation 
        textSize(10);
        text("*The height of the bar is mapped to the lowest and highest value of that particular rate's data",260,547);
        text("*If the bar graph is not shown, the data is too small for it to be drawn in the graph",260,560);
        textSize(18);

        //cursor line x & y for mouse
        stroke(200);
        line(mouseX,layout.bottomMargin,mouseX,layout.topMargin);
        line(layout.leftMargin-15,mouseY,layout.rightMargin,mouseY);

        // Draw all y-axis labels.
        drawYAxisTickLabelsPopulation(mindeath,maxdeath,layout,mapdeathratetoheight.bind(this),2);

        // Draw x and y axis labels.
        drawAxisLabels(xAxisLabel,yAxisLabel,layout);

        // starting points for drawing the bar graph rect for each of the different rates, such as birth rate, death rate and also the line graph for the population
        var previous;
        var numYears = endyear - startyear+1;
        var death_y_point = [];
        var death_x_point = [];
        var birth_y_point = [];
        var birth_x_point = [];

        // drawing the death rate bar (red)
        for (var i=0; i<death.length; i++)
        {
            // pushing the mapped value of death point y to arrays of death point y 
            append(death_y_point, mapdeathratetoheight(death[i]));
        }

        for (var i=0; i<year.length; i++)
        {
            // pushing the mapped value of death point x to arrays of death point x 
            append(death_x_point, mapYearToWidth(year[i]))
        }
        // if selection of data from selection2 is either death rate or both
        if (type_of_data == 'Death Rate' || type_of_data =='Birth Rate and Death Rate')
        {
            for (var i=0;i<death_y_point.length;i++)
            {
                //red bar graph
                fill(255,0,0,);
                //bar graph rect for death rate 
                rect(death_x_point[i],death_y_point[i],15,layout.bottomMargin - death_y_point[i]);
                // The number of x-axis labels to skip so that only numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / layout.numXTickLabels);
                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0)
                {
                    drawXAxisTickLabel(year[i],layout,mapYearToWidth.bind(this));
                }
            }
        }
        // drawing the birth rate bar (blue)
        for (var i=0; i<birth.length; i++)
        {
            // pushing the mapped value of birth point y to arrays of birth point y 
            append(birth_y_point, mapbirthratetoheight(birth[i]));
        }

        for (var i=0; i<year.length; i++)
        {
            // pushing the mapped value of birth point x to arrays of birth point x 
            append(birth_x_point, mapYearToWidth(year[i]))
        }
        //if selection of data from selection2 is either birth rate or both
        if (type_of_data == 'Birth Rate' || type_of_data == 'Birth Rate and Death Rate')
        {
            for (var i=0;i<birth_y_point.length;i++)
            {
                //blue bar graph 
                fill(0,0,255,);
                // bar graph rect for birth red
                rect(birth_x_point[i]-15,birth_y_point[i],15,layout.bottomMargin - birth_y_point[i]);
                // The number of x-axis labels to skip so that only numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / layout.numXTickLabels);
                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) 
                {
                    drawXAxisTickLabel(year[i], layout,mapYearToWidth.bind(this));
                }
            }
        }
        //drawing the line graph for population of each country
        for (var i = 0; i < 20; i++) 
        {
            // Create an object to store data for the current year.
            var current = {
              // Convert strings to numbers.
              'year': year[i],
              'population': population[i]
            };
            if (previous != null) 
            {
              // Draw line segment connecting previous year to current year pay gap.
              stroke(0);
              fill(0);
              line(mapYearToWidth(previous.year),
                  mappopulationtoheight(previous.population),
                  mapYearToWidth(current.year),
                  mappopulationtoheight(current.population));
                  
            }
            // Assign current year to previous year so that it is available during the next iteration of this loop to give us the start position of the next line segment.
            previous = current;
        }
        // Draw x and y axis.
        drawAxisX(layout);
        //draw legends for the graph
        drawLegend();
        //function if mouse is over the bar graph 
        mouseOver();

        // function to draw the Axis
        function drawAxisX(layout, colour=0) {
            stroke(color(colour));
            // x-axis
            line(layout.leftMargin,
                 layout.bottomMargin,
                 layout.rightMargin+15,
                 layout.bottomMargin);
            //y-axis single line (left)
            stroke(200);
            line(layout.leftMargin-15,
                 layout.bottomMargin,
                 layout.leftMargin-15,
                 layout.topMargin);
            fill(0);
            //y-axis single line (right)
            line(layout.rightMargin+15,
                 layout.bottomMargin,
                 layout.rightMargin +15,
                 layout.topMargin);
        }

        // drawing the Y axis tick labels
        function drawYAxisTickLabelsPopulation(min, max, layout, mapFunction,decimalPlaces) 
        {
            // Map function must be passed with .bind(this).
            var range = max - min;
            var yTickStep = range / layout.numYTickLabels;
          
            fill(0);
            noStroke();
            textAlign('right', 'center');
          
            // Draw all axis tick labels and grid lines.
            for (i = 0; i <= layout.numYTickLabels; i++)
            {
                var value = min + (i * yTickStep);
                var y = mapFunction(value);
            
                if (layout.grid)
                {
                    // Add grid line.
                    stroke(200);
                    line(layout.leftMargin, y, layout.rightMargin+15, y);
                    line(layout.leftMargin,y,layout.leftMargin-15,y);
                }
            }
        };
        //mapping death rate value to height of bar graph
        function mapdeathratetoheight(value)
        {
            return map(value,mindeath,maxdeath,layout.bottomMargin,layout.topMargin);
        };
        //mapping year value to width of bar graph
        function mapYearToWidth(value)
        {
            return map(value,startyear,endyear,layout.leftMargin,layout.rightMargin);
        };
        //mapping population value to height of bar graph
        function mappopulationtoheight(value)
        {
            return map(value,minpop,maxpop,layout.bottomMargin,layout.topMargin);
        };
        //mapping birth rate value to height of bar graph
        function mapbirthratetoheight(value)
        {
            return map(value,minbirth,maxbirth,layout.bottomMargin,layout.topMargin);
        };
        //function to draw the legend of the bar graph
        function drawLegend()
        {
            //formating the numbers with commas for every 1000s
            var num = nfc(populations);
            //combining text and data value to a variable to be shown as text in legends
            var year_text = 'Year : ' + years;
            var death_text = 'Death Rate : ' + death_people;
            var birth_text = 'Birth Rate: ' + birth_people;
            var pop_text = 'Population: ' + num;
            //drawing of legends section
            //box for legend
            fill(240);
            strokeWeight(0);
            textSize(12);
            textAlign(LEFT, TOP);
            rect(200, 45, 150, 60);
            //death legend
            fill(255,0,0);
            rect(210,55,10,10);
            fill(0);
            text ('Death Rate', 237, 53)
            //birth legend
            fill(0,0,255);
            rect(210, 70, 10, 10);
            fill(0);
            text ('Birth Rate', 237, 68)
            //population legend
            strokeWeight(1);
            stroke(1);
            fill(0);
            line(210,85,215,95);
            line(215,95,220,90);
            line(220,90,225,95);
            line(225,95,230,95);
            line(230,95,235,100);
            strokeWeight(0);
            stroke(0);
            text ('Population', 237, 86);
            //reset back to normal settings
            strokeWeight(1);    
            textSize(16);
        };
        //function when a mouse is over a bar graph
        function mouseOver(data)
        {
            // starting points for drawing the RED bar graph rectangle overlay (to show it hovers) for each of the different rates, such as birth rate and death rate
            var death_y_point = [];
            var death_x_point = [];
            var birth_y_point = [];
            var birth_x_point = [];
            var v = 0;
            //SG DEATH RATE
            for (var i=0; i<death.length; i++)
            {
                //pushing the mapped value of death rate to height into death y point array
                append(death_y_point, mapdeathratetoheight(death[i]));
            }
            for (var i=0; i<death.length; i++)
            {
                //pushing the mapped value of death rate to height into death x point array
                append(death_x_point, mapYearToWidth(year[i]))
            }
            //SG BIRTH RATE
            for (var i=0; i<birth.length; i++)
            {
                //pushing the mapped value of birth rate to height into death y point array
                append(birth_y_point, mapbirthratetoheight(birth[i]));
            }
            for (var i=0; i<birth.length; i++)
            {
                //pushing the mapped value of birth rate to height into death x point array
                append(birth_x_point, mapYearToWidth(year[i]));
            }

            //for every points in the array...(loop)
            for (var i = 0; i<death_x_point.length; i++)
            {

                //DEATH RATE bar graph
                //if selection 2 value is either death rate or both 
                if (type_of_data == 'Death Rate' || type_of_data == 'Birth Rate and Death Rate')
                {
                    //if mouse hovers over the bar graph's width
                    if(mouseX > death_x_point[i] && mouseX < death_x_point[i] + 15)
                    {
                        //green bar graph to signify hovering
                        fill(0,255,0);
                        //draw rect over the current bar graph that is being hovered 
                        rect(death_x_point[i]+1,death_y_point[i],15,layout.bottomMargin - death_y_point[i]);

                        //drawing the data beside the mouse when hovered
                        // box color for the text beside the mouse
                        fill(0);
                        textSize(12);
                        stroke(2);
                        textAlign(LEFT, TOP);
                        //the black box rectangle to write down the text beside the mouse
                        rect(mouseX-70, mouseY-70,140, 45);
                        //text color
                        fill(255);
                        //formatting the number with commas in the 1000s
                        var numdeath = nfc(death[i]);
                        var numpop = nfc(population[i]);
                        var numyear = year[i]
                        //combining texts and data to be shown in the black box beside the mouse
                        text('Year: ' + numyear,mouseX-60,mouseY-64,200);
                        text('Population: ' + numpop,mouseX-60,mouseY-52,200);
                        text('Death Rate: ' + numdeath,mouseX-60,mouseY-40,200);
                        //location and value of datas of the current bar graph being hovered
                        death_people = death[i];
                        years = year[i];
                        //reset text back to default
                        textSize(16);

                    }
                }
                
                //BIRTH RATE bar graph
                //if selection 2 value is either birth rate or both 
                if (type_of_data == 'Birth Rate' || type_of_data == 'Birth Rate and Death Rate')
                {
                    //if mouse hovers over the bar graph's width
                    if(mouseX > birth_x_point[i]-15 && mouseX < birth_x_point[i])
                    {
                        //green bar graph to signify hovering
                        fill(0,255,0);
                        //draw rect over the current bar graph that is being hovered 
                        rect(birth_x_point[i]-15,birth_y_point[i],15,layout.bottomMargin - birth_y_point[i]);
                        //drawing the data beside the mouse when hovered
                        // box color for the text beside the mouse
                        fill(0);
                        textSize(12);
                        stroke(2);
                        textAlign(LEFT, TOP);
                        //the black box rectangle to write down the text beside the mouse
                        rect(mouseX-70, mouseY-70,140, 45);
                        //text color
                        fill(255);
                        //formatting the number with commas in the 1000s
                        var numbirth = nfc(birth[i]);
                        var numpop = nfc(population[i]);
                        var numyear = year[i];
                        //combining texts and data to be shown in the black box beside the mouse
                        text('Year: ' + numyear,mouseX-60,mouseY-64,200);
                        text('Population: ' + numpop,mouseX-60,mouseY-52,200);
                        text('Birth Rate: ' + numbirth,mouseX-60,mouseY-40,200);
                        //location and value of datas of the current bar graph being hovered
                        birth_people = birth[i];
                        populations = population[i];
                        years = year[i];
                        //reset text back to default
                        textSize(16);
                    }
                }
            }    
        }
    }
    //function to draw title
    function drawTitle()
    {
        fill(0);
        noStroke();
        textAlign('center', 'center');
        text(title,(layout.plotWidth() / 2) + layout.leftMargin,layout.topMargin - (layout.marginSize / 2));
    };
}