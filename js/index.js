const w = 1500;
const h = 750;
const geoPath = d3.geoPath();
const geojson = topojson.feature(geoTopology, geoTopology.objects.counties);


const returnEductionData = d => {
  let el =  educationData.find(function(element) {
    return (element.fips == d.id) ;                  
  });

return el.bachelorsOrHigher;
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
           .attr("class", "county")
           .attr("data-fips", d => d.id)
           .attr("data-education", d => returnEductionData(d))
           .on("mouseover",(d)=>{ 

              let tooltipElem = document.getElementById("tooltip");          
              tooltipElem.style.display = "block";
              
  //            tooltipElem.innerText = `${getMonth(d.month)} ${d.year}\n` ;

              tooltipElem.innerText = `${d.id}\n` ;
              tooltipElem.setAttribute("data-education", returnEductionData(d));
          
              // tooltipElem.style.left= (xScale(d.year) + tooltipOffsetHorizontal) + "px";
              // tooltipElem.style.top = (yScale(d.month) + tooltipOffsetVertical) + "px";
          
          })
            .on("mouseout",()=>{ 
            
                let tooltipElem = document.getElementById("tooltip");
                    
                tooltipElem.style.display = "none";
            
            });


// Create a legend

svg.append("g")
   .attr("id","legend")
   .attr("transform","translate(900,600)");
