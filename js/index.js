const w = 1500;
const h = 750;
const geoPath = d3.geoPath();

//Create SVG element
const svg = d3.select("body")
           .append("svg")
           .attr("width", w)
           .attr("height",h);

           svg
           .append("path")
           .attr("d",geoPath(geoTopology.objects.counties));

