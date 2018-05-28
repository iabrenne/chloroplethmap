const w = 1500;
const h = 900;
const geoPath = d3.geoPath();
const geojson = topojson.feature(geoTopology, geoTopology.objects.counties);
const minEducation = d3.min(educationData, d => d.bachelorsOrHigher);
const maxEducation = d3.max(educationData, d => d.bachelorsOrHigher);

const colorRanges = ["rgb(255, 209, 220)",
                     "rgb(255, 192, 203)",
                     "rgb(255, 183, 197)",
                     "rgb(252, 142, 172)",
                     "rgb(231, 84,	128	)",
                     "rgb(222, 93,	131)",
                     "rgb(222, 49,  99)",
                     "rgb(227, 11, 93)" ];

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

              tooltipElem.innerText 
                = `${getCountyElement(d).area_name}, ${getCountyElement(d).state}:  ${getCountyElement(d).bachelorsOrHigher}%\n` ;
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
   .attr("transform","translate(900,300)");

const legend = d3.legendColor()                 
                 .labels( function({i, genLength}){ 
                            let educationRange = (maxEducation - minEducation ) / genLength ;                            
                            let endOfRange = educationRange * (i+1);
                            let startOfRange = (i==0) ? minEducation : endOfRange  - educationRange;
                            return `${d3.format(".2f")(startOfRange)}%- ${d3.format(".2f")(endOfRange)}% `; 
                        })
                 .shape("rect")
                 .shapeHeight(20)
                 .shapeWidth(40)
                 .orient("vertical")
                 .scale(quantile);

svg.select("#legend")
   .call(legend);
