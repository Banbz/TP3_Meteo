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
        .attr("fill", "black")
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
});




