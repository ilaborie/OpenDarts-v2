/*
 Copyright 2012 Igor Laborie

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var distPieColor = [
    "#7f7f7f", // zone 0
    "#7a7f78", // zone 10
    "#707f6e", // zone 20
    "#717f6f", // zone 30
    "#687f64", // zone 40
    "#607f5c", // zone 50
    "#4a7f42", // zone 60
    "#375e6e", // zone 70
    "#243d9d", // zone 80
    "#1514cc", // zone 90
    "#1000fb", // zone 100
    "#1600eb", // zone 110
    "#1f00db", // zone 120
    "#2a00cc", // zone 130
    "#3600bc", // zone 140
    "#4300ac", // zone 150
    "#50009d", // zone 160
    "#5e068d"]; // zone 170

var loadPieData = function (player, game) {
    var res = [];
    var val;
    for (var i = 0; i < 18; i++) {
        val = {
            value: game.getStats("zone" + i, player),
            label: i
        };
        res.push(val);
    }
    return res;
};

var diplayPie = function (selector, player, game) {
    var data = loadPieData(player, game);
    diplayPieData(selector, data, player.getName());
};

var diplayPieData = function (selector, data, title) {
    var width = 250;
    var height = 250;
    var outerRadius = Math.min(width, height) / 2;
    var innerRadius = outerRadius * 0.999;
    // for animation
    var innerRadiusFinal = outerRadius * 0.5;
    var innerRadiusFinal3 = outerRadius * 0.4;

    var vis = d3.select(selector)
        .append("svg:svg")         //create the SVG element inside the <body>
        .data([data])        //associate our data with the document
        .attr("width", width)      //set the width and height of our visualization (these will be attributes of the <svg> tag
        .attr("height", height * 0.55)
        .append("svg:g")        //make a group to hold our pie chart
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");    //move the center of the pie chart from 0, 0 to radius, radius


    var arc = d3.svg.arc() // this will create <path> elements for us using arc data
        .outerRadius(outerRadius).innerRadius(innerRadius);

    // for animation
    var arcFinal = d3.svg.arc()
        .innerRadius(innerRadiusFinal)
        .outerRadius(outerRadius);
    var arcFinal3 = d3.svg.arc()
        .innerRadius(innerRadiusFinal3)
        .outerRadius(outerRadius);

    var pie = d3.layout.pie()  //this will create arc data for us given a list of values
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2)
        .sort(null)
        .value(function (d) {
            return d.value;
        }); //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                  //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                 //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice")       //allow us to style things in the slices (like text)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    arcs.append("svg:path")
        .attr("fill", function (d, i) {
            return distPieColor[i];
        }) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        .append("svg:title") //mouseover title showing the figures
        .text(distLabel);

    var duration = 100;
    d3.selectAll("g.slice").selectAll("path").transition()
        .duration(duration)
        .delay(10)
        .attr("d", arcFinal);

    // Add a label to the larger arcs, translated to the arc centroid and rotated.
    // source: http://bl.ocks.org/1305337#index.html
    arcs.filter(function (d) {
        return d.endAngle - d.startAngle > 0.1;
    })
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            //return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
            return "translate(" + arcFinal.centroid(d) + ")";
        })
        //.text(function(d) { return formatAsPercentage(d.value); })
        .text(distLabel);

    // Pie chart title
    vis.append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(title)
        .attr("class", "title");

    function mouseover() {
        d3.select(this).select("path").transition()
            .duration(duration)
            //.attr("stroke","red")
            //.attr("stroke-width", 1.5)
            .attr("d", arcFinal3);
    }

    function mouseout() {
        d3.select(this).select("path").transition()
            .duration(duration)
            //.attr("stroke","blue")
            //.attr("stroke-width", 1.5)
            .attr("d", arcFinal);
    }
};

var distLabel = function (d) {
    //return "" + i*10 + "-" +(i+1)*10;
    //return getStatLabel(x01.stats.game,"statsZone"+i);
    return getStatLabel(x01.stats.game, "zone" + d.data.label);
};

// Computes the label angle of an arc, converting from radians to degrees.
var angle = function (d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
};