const w = 1500;
const h = 750;
const geoPath = d3.geoPath();
var geojson = topojson.feature(geoTopology, geoTopology.objects.counties);

//Create SVG element
const svg = d3.select("body")
           .append("svg")
           .attr("width", w)
           .attr("height",h);

           svg
           .append("g")             
           .selectAll("path")
           .data(geojson.features)
           .enter().append("path")
             .attr("d",geoPath)
             .attr("class", "county")
             .attr("data-fips", d => d.id)
             .attr("data-education", 
                    d => {
                      var el =  educationData.find(function(element) {
                        return (element.fips == d.id) ;                  
                    });

                    return el.bachelorsOrHigher;

                  });
