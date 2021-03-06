var margin = {top: 50, right: 50, bottom: 50, left: 50};

// The number of datapoints
var n = 28;

var request = d3.json("./json/meteo.json").then(loadJson).catch(console.error);

var data = [];

function loadJson(f) {
    data = f;
    createTemp();
}

function createTemp(){
    var result = data.map(function (e) {
        return {
            t: (e.t)/100,
        }
    });

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output


// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(result, dataPoint => dataPoint.t)]) // input
        .range([height, 0]); // output


// 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = d3.range(n).map(function(d) { return {"y": result[d]["t"] } });

// 1. Add the SVG to the page and employ #2
    var svg = d3.select("#line_temp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Température en °C");

// 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

    var tool = d3.select("#wrapper").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// 12. Appends a circle for each datapoint
    svg.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d.y) })
        .attr("r", 5)
        .on("mouseover", function(a, b, c) {
            tool.transition()
                .duration(200)
                .style("opacity", .9);
            tool.html("Température : " + a['y'] + " °C")
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
        })
        .on("mouseout", function() {
            tool.style("opacity", 0);
            tool.html("")
                .style("left", "-500px")
                .style("top", "-500px");
        })
}

