const width = 750, height = 750;

const projection = d3.geoConicConformal()
    .center([2.5, 46])
    .scale(3500)
    .translate([width / 2, height / 2]);

var data = [];
var stations = [];
var nomStations = [];

var request = d3.json("./json/meteo.json")
    .then(loadJson).catch(console.error);

function loadJson(d){
    data = d;
    createStation();
    createWeatherMap();
    createVille();
}

function Day(){
    var day = 1;
    var meteoDate = $('#datepicker').datepicker('getDate');
    if (meteoDate !== null) { // if any date selected in datepicker
        meteoDate instanceof Date; // -> true
        day = meteoDate.getDate();
        meteoDate.getMonth();
        meteoDate.getFullYear();
    }
    return day;
}

function createWeatherMap() {

    const path = d3.geoPath();

    path.projection(projection);

    const svg = d3.select('#map')
        .append("svg")
        .attr("id", "svg")
        .attr("viewBox", "0 0 " + width * 1.15 + " " + height);

    const deps = svg.append("g");

    d3.json('./json/departments.json').then(function(geojson) {
        deps.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr('class', 'department')
            .attr('fill', '#486DDA')
            .attr("d", path);
    });
}

function createStation(){
    for(var i = 0; i < data.length; i++)
    {
        for(var j = 0; j < data[i]['station'].length; j++)
        {
            if(!nomStations.includes(data[i]['station'][j]['n']))
            {
                nomStations.push(data[i]['station'][j]['n']);
                var nom = data[i]['station'][j]['n'];
                var latitude = data[i]['station'][j]['lat'];
                var longitude = data[i]['station'][j]['lng'];

                var detailDay = [];
                for(var l = 0; l < data.length; l++)
                {
                    for(var m = 0; m < data[l]['station'].length; m++)
                    {
                        if(data[l]['station'][m]['n'] == nom){

                            var temp = data[l]['station'][m]['t'];
                            var TempMoy = parseFloat(temp/100);
                            var PreciMoy = parseFloat(data[l]['station'][m]['p']);
                            var min = 0;
                            var max = 0;

                            for(var z = 0; z < data[l]['station'][m]['hours'].length; z++)
                            {
                                if(z == 0)
                                {
                                    max = data[l]['station'][m]['hours'][z]['t']/100;
                                    min = data[l]['station'][m]['hours'][z]['t']/100;
                                }
                                if(data[l]['station'][m]['hours'][z]['t']/100 > max)
                                {
                                    max = data[l]['station'][m]['hours'][z]['t']/100;
                                }
                                if(data[l]['station'][m]['hours'][z]['t']/100 < min) {
                                    min = data[l]['station'][m]['hours'][z]['t']/100;
                                }
                            }

                            var infoMeteo = {
                                TempMoy : TempMoy,
                                PreciMoy : PreciMoy,
                                min : min,
                                max : max,
                                detailHeure : data[l]['station'][m]['hours']
                            }
                            detailDay.push(infoMeteo);
                        }
                    }
                }
                var infoStation = {
                    nom: nom,
                    latitude: latitude,
                    longitude : longitude,
                    detailDay : detailDay
                };

                stations.push(infoStation);
                let dropdown = $('#station_select');

                dropdown.empty();

                dropdown.append('<option selected="true" disabled>Choix Station</option>');
                dropdown.prop('selectedIndex', 0);

                $.each(stations, function (key, entry) {
                    dropdown.append($('<option></option>').attr('value', entry.nom).text(entry.nom));
                });
            }
        }
    }
}

function updateStation()
{
    day = Day();
    d3.selectAll("svg image")    .attr("xlink:href", function (d) {
        if(d.detailDay.length >= day){
            if(d.detailDay[day - 1]['TempMoy'] <= 1 && d.detailDay[day - 1]['PreciMoy'] >= 0.75 && d.detailDay[day - 1]['TempMoy'] >= -3)
                return "./img/snow.svg";
            else if( d.detailDay[day - 1]['TempMoy'] >= 25 && d.detailDay[day - 1]['PreciMoy'] <= 0.15)
                return "./img/sun.svg";
            else if(d.detailDay[day - 1]['PreciMoy'] >= 0.50)
                return "./img/rain.svg";
            else if(d.detailDay[day - 1]['PreciMoy'] >= 0.25 )
                return "./img/cloud-sun.svg";
            else if(d.detailDay[day - 1]['PreciMoy'] > 0.00 && d.detailDay[day - 1]['TempMoy'] <= 15)
                return "./img/cloud.svg";
            else if(d.detailDay[day - 1]['PreciMoy'] == 0.00)
                return "./img/sun.svg";
        }
    })

    d3.selectAll("#map svg text").text(function(d){
        try {
            if(d.detailDay.length > day - 1)
            {
                return d.detailDay[day - 1]['TempMoy'] + "°C";
            }
        }
        catch(error) {
        }
    });
}

function createVille() {

    day = Day();

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("left", "-500px")
        .style("top", "-500px");

    var svg = d3.select("#map").select("svg");

    var elem = svg.selectAll("g")
        .data(stations);

    var elemEnter = elem.enter()
        .append("g");

    var circle = elemEnter.append("image")
        .attr("xlink:href", function (d) {
            if(d.detailDay.length >= day){
                if(d.detailDay[day - 1]['TempMoy'] <= 1 && d.detailDay[day - 1]['PreciMoy'] >= 0.75 && d.detailDay[day - 1]['TempMoy'] >= -1)
                    return "./img/snow.svg";
                else if( d.detailDay[day - 1]['TempMoy'] >= 20 && d.detailDay[day - 1]['PreciMoy'] <= 0.2)
                    return "./img/sun.svg";
                else if(d.detailDay[day - 1]['PreciMoy'] >= 1)
                    return "./img/rain.svg";
                else if(d.detailDay[day - 1]['PreciMoy'] >= 0.25 )
                    return "./img/cloud-sun.svg";
                else if(d.detailDay[day - 1]['PreciMoy'] > 0.00 && d.detailDay[day - 1]['TempMoy'] <= 15)
                    return "./img/cloud.svg";
                else if(d.detailDay[day - 1]['PreciMoy'] == 0.00)
                    return "./img/sun.svg";
            }
        })
        .attr("x", function (d) { return projection([d.longitude, d.latitude])[0] - 15; })
        .attr("y", function (d) { return projection([d.longitude, d.latitude])[1] - 15; })
        .attr("width", "40px")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Station de " + d.nom+ "<br/>"
                + " T° mini du jour : " + d.detailDay[day - 1]['min'] + "°C</br>"
                + "T° maxi du jour : " + d.detailDay[day - 1]['max'] + "°C</br>"
                + "Précipitation du jour : " + d.detailDay[day - 1]['PreciMoy'] + "mm</br>")
                .style("left", (d3.event.pageX - 10) + "px")
                .style("top", (d3.event.pageY - 10) + "px");
        })
        .on("mouseout", function(d) {
            div.style("opacity", 0);
            div.html("")
                .style("left", "-500px")
                .style("top", "-500px");
        });
}
