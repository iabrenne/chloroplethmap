const w = 1500;
const h = 750;
const geoPath = d3.geoPath();
const geojson = topojson.feature(geoTopology, geoTopology.objects.counties);
const minEducation = d3.min(educationData, d => d.bachelorsOrHigher);
const maxEducation = d3.max(educationData, d => d.bachelorsOrHigher);

const colorRanges = ["rgb(102, 102, 51)",
                     "rgb(153, 204, 0)",
                     "rgb(204, 255, 51)",
                     "rgb(255, 255, 102)",
                     "rgb(255, 204, 102)",
                     "rgb(255, 153, 102)",
                     "rgb(255, 102, 102)",
                     "rgb(255, 0, 102)",
                     "rgb(204, 102, 153)",
                     "rgb(153, 51, 102)"];

const quantile = d3.scaleQuantile()
                   .domain([minEducation,maxEducation])
                   .range(colorRanges);

const getCountyElement = d => {

  let el =  educationData.find(function(element) {
    return (element.fips == d.id) ;                  
  });

  return el;

};


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
           .attr("fill",d => quantile(getCountyElement(d).bachelorsOrHigher ) )
           .attr("class", "county")
           .attr("data-fips", d => d.id)
           .attr("data-education", d => getCountyElement(d).bachelorsOrHigher)
           .on("mouseover",(d)=>{ 

              let tooltipElem = document.getElementById("tooltip");          
              tooltipElem.style.display = "block";
              
  //            tooltipElem.innerText = `${getMonth(d.month)} ${d.year}\n` ;

              tooltipElem.innerText = `${d.id}\n` ;
              tooltipElem.setAttribute("data-education", getCountyElement(d).bachelorsOrHigher );
          
              tooltipElem.style.left= d3.event.clientX + "px";
              tooltipElem.style.top = d3.event.clientY + "px";
          
          })
            .on("mouseout",()=>{ 
            
                let tooltipElem = document.getElementById("tooltip");
                    
                tooltipElem.style.display = "none";
            
            });


// Create a legend

svg.append("g")
   .attr("id","legend")
   .attr("transform","translate(900,600)");

const legend = d3.legendColor()                 
                 .labels( function({i, genLength}){ 
                            return d3.format(".2f")( ( maxEducation - minEducation ) / genLength  * (i+1)); 
                        })
                 .shape("circle")
                 .shapeRadius(21)
                 .orient("horizontal")
                 .scale(quantile);

svg.select("#legend")
   .call(legend);
