"use strict";
(function() {
const svgSize = {
    width: 800,
    height: 700,
}

    window.addEventListener("load", init);

    function init() {
        const svgContainer = d3.select("body").append('svg')
                                .attr('width', svgSize.width)
                                .attr('height', svgSize.height);

        const neigb = svgContainer.append("g");

        d3.json("nygeo.json")
            .then((data) => {
                d3.csv("data.csv").then(function(pointData) {

                    const albersProj = d3.geoAlbers()
                        .scale(90000)
                        .rotate([74.0060,0])
                        .center([0, 40.7128])
                        .translate([svgSize.width/2, svgSize.height/2]);

                    let geoPath = d3.geoPath().projection(albersProj);

                    neigb.selectAll('path')
                        .data(data.features)
                        .enter()
                        .append('path')
                            .attr('fill', '#ccc')
                            .attr('d', geoPath);
                    
                    svgContainer.selectAll('.circle')
                        .data(pointData)
                        .enter()
                        .append('circle')
                            .attr('cx', function(d) { 
                                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                                return scaledPoints[0]
                            })
                            .attr('cy', function(d) {
                                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                                return scaledPoints[1]
                            })
                            .attr('r', 5)
                            .attr('fill', 'steelblue')
                            .on("click",function() {
                                d3.select(this)
                                    .attr("opacity",1)
                                    .transition()
                                    .duration( 1000 )
                                    .attr( "cx", svgSize.width * Math.round( Math.random() ) )
                                    .attr( "cy", svgSize.height * Math.round( Math.random() ) )
                                    .attr( "opacity", 0 )
                                    .on("end",function(){
                                        d3.select(this).remove();
                                    })
                            });
                })
            })
    }
})();