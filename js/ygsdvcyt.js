const width = 700, height = 700;
const path = d3.geoPath();
const projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(3500)
    .translate([width / 2, height / 2]);
path.projection(projection);

const svg = d3
    .select("#map")
    .append("svg")
    .attr("id", "svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
;
const deps = svg.append("g");
d3.json('./json/departments.json').then(function(geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("fill", "#486DDA")
        .attr("d", path);
});

d3.json('./json/meteo.json').then(function(data) {
    var stations = data[0]["station"];
    var result = stations.map(function(e){
        return{
            lat : e.lat,
            lng : e.lat,
            name : e.n,
        }
    })
    console.log(result);

    let dropdown = $('#station_select');

    dropdown.empty();

    dropdown.append('<option selected="true" disabled>Choix Station</option>');
    dropdown.prop('selectedIndex', 0);

    $.each(result, function (key, entry) {
        dropdown.append($('<option></option>').attr('value', entry.name).text(entry.name));
    });
});


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json('./json/departments.json').then(function(geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('class', 'department')
        .attr("fill", "#486DDA")
        .attr("d", path)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Département : " + d.properties.NOM_DEPT + "<br/>"
                +  "Région : " + d.properties.NOM_REGION)
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
        })
        .on("mouseout", function(d) {
            div.style("opacity", 0);
            div.html("")
                .style("left", "-500px")
                .style("top", "-500px");
        });
});





