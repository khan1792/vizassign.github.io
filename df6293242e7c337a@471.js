// https://observablehq.com/@khan1792/assignments@471
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Assignments`
)});
  main.variable(observer("explain0")).define("explain0", ["md"], function(md){return(
md`<span style="color:red">Please wait for a dozen seconds to load the graph.</span>`
)});
  main.variable(observer("explain1")).define("explain1", ["md"], function(md){return(
md`In this visualization, you can select different modes to explore the data.`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("trees")).define("trees", ["d3"], function(d3){return(
d3.csv("https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D", d3.autoType)
)});
  main.variable(observer("explain2")).define("explain2", ["md"], function(md){return(
md`<font size="3">Please choose one mode from Variables, Zoom Only, and Bush Only for visualization. If you choose the mode Variables, please also choose a variable from COND, SIDE, and TREETYPE to visualize the variable based on color. If you choose the mode Brush, please also choose whether you want to show the boundary, as well as its color, to help you select the area. You can also adjust the size of the graph.</font>`
)});
  main.variable(observer("explain3")).define("explain3", ["md"], function(md){return(
md`<font size="3">Please select in terms of **Mode**, **Variables**, **Boundary** with its **Color**, and **Graph Size**</font>`
)});
  main.variable(observer("viewof mode")).define("viewof mode", ["html"], function(html){return(
html`<select>
  <option> Variables
  <option> Zoom Only
  <option> Brush Only
</select>`
)});
  main.variable(observer("mode")).define("mode", ["Generators", "viewof mode"], (G, _) => G.input(_));
  main.variable(observer("viewof variable")).define("viewof variable", ["html"], function(html){return(
html`<select>
  <option> COND
  <option> SIDE
  <option> TREETYPE
</select>`
)});
  main.variable(observer("variable")).define("variable", ["Generators", "viewof variable"], (G, _) => G.input(_));
  main.variable(observer("viewof boundary")).define("viewof boundary", ["html"], function(html){return(
html`<select>
  <option> Yes
  <option> No
</select>`
)});
  main.variable(observer("boundary")).define("boundary", ["Generators", "viewof boundary"], (G, _) => G.input(_));
  main.variable(observer("viewof color")).define("viewof color", ["html"], function(html){return(
html`<input type="color" value="grey">`
)});
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer("viewof picsize")).define("viewof picsize", ["html"], function(html){return(
html`<input type="range" min="100" max="2000" value="700">`
)});
  main.variable(observer("picsize")).define("picsize", ["Generators", "viewof picsize"], (G, _) => G.input(_));
  main.variable(observer("results")).define("results", ["mode","picsize","d3","trees","variable","Promises","makeTrees","boundary","color"], async function*(mode,picsize,d3,trees,variable,Promises,makeTrees,boundary,color)
{if (mode == "Variables"){ 
  const width = picsize;
  const height = picsize;
  const infoPanel = d3.select("#mytreeinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, 1, 1])
  .style("border", "solid 1px black");
  yield svg.node();
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, 1.0]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([1.0, 0.0]);
  if (variable == 'SIDE'){
  const colorScale = d3.scaleOrdinal().domain(d3.group(trees, d => d.SIDE)).range(d3.schemeCategory10);
  svg.selectAll("g")
  .data(d3.group(trees, d => d.SIDE))
  .enter()
  .append("g")
  .attr("id", d => ""+d[0])
  .style("fill", d => colorScale(d[0]))
  .selectAll("circle")
  .data(d => d[1])
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.001);
  for (const v of ["Side Away", "Front", "Side To" , "Side", "Rear", "Median"]) {
    svg.select("g#" + v).selectAll("circle").attr("r", 0.005);
    await Promises.delay(5000);
    svg.select("g#" + v).selectAll("circle").attr("r", 0.001);
  }
} else if (variable == 'COND') {
  const colorScale = d3.scaleOrdinal().domain(d3.group(trees, d => d.COND)).range(d3.schemeCategory10);
  svg.selectAll("g")
  .data(d3.group(trees, d => d.COND))
  .enter()
  .append("g")
  .attr("id", d => ""+d[0])
  .style("fill", d => colorScale(d[0]))
  .selectAll("circle")
  .data(d => d[1])
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.001);
  for (const v of ["Fair", "Good", "Excellent", "Critical", "Dead", "Poor", "Very Good"]) {
    svg.select("g#" + v).selectAll("circle").attr("r", 0.005);
    await Promises.delay(5000);
    svg.select("g#" + v).selectAll("circle").attr("r", 0.001);
  }
} else if (variable == 'TREETYPE') {
  const colorScale = d3.scaleOrdinal().domain(d3.group(trees, d => d.TREETYPE)).range(d3.schemeCategory10);
  svg.selectAll("g")
  .data(d3.group(trees, d => d.TREETYPE))
  .enter()
  .append("g")
  .attr("id", d => ""+d[0])
  .style("fill", d => colorScale(d[0]))
  .selectAll("circle")
  .data(d => d[1])
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.001);
  for (const v of ["Tree", "Vacant Site", "Retired", "Stump", ""]) {
    svg.select("g#" + v).selectAll("circle").attr("r", 0.005);
    await Promises.delay(5000);
    svg.select("g#" + v).selectAll("circle").attr("r", 0.001);
  }
}
  const treeGroup = svg.select("g#trees");
  const brush = d3.brush().extent([[0, 0], [20, 20]]).handleSize(0.1);
  function brushCalled(event) {
    treeGroup.selectAll("circle")
    .data(trees)
    .classed("selected", d => xScale(d.X) > event.selection[0][0]
                && xScale(d.X) < event.selection[1][0]
                && yScale(d.Y) > event.selection[0][1]
                && yScale(d.Y) < event.selection[1][1] );
  }
  svg.append("g")
    .attr("class", "mybrush")
    .style("stroke-width", 0.01)
    .call(brush.on("brush", brushCalled));
  const quadtree = d3
  .quadtree()
  .x( d => xScale(d.X))
  .y( d => yScale(d.Y))
  .addAll(trees);
} else if (mode == "Zoom Only"){
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const zoom = d3.zoom();
  const trees = svg.select("g#trees");
  function zoomCalled(event) {
    const zx = event.transform.rescaleX(xScale);
    const zy = event.transform.rescaleY(yScale);
    trees.transition().duration(0).attr("transform", event.transform);
  }
  svg.call(zoom.on("zoom", zoomCalled));
  
} else if (mode == "Brush Only") {
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const treeGroup = svg.select("g#trees");
  const brush = d3.brush().extent([[0, 0], [20, 20]]).handleSize(0.1);
  function brushCalled(event) {
    treeGroup.selectAll("circle")
    .data(trees)
    .classed("selected", d => xScale(d.X) > event.selection[0][0]
                && xScale(d.X) < event.selection[1][0]
                && yScale(d.Y) > event.selection[0][1]
                && yScale(d.Y) < event.selection[1][1] );
  }
  svg.append("g")
    .attr("class", "mybrush")
    .style("stroke-width", 0.01)
    .call(brush.on("brush", brushCalled));
  if (boundary == 'Yes'){
  const quadtree = d3
  .quadtree()
  .x( d => xScale(d.X))
  .y( d => yScale(d.Y))
  .addAll(trees);
  quadtree.visit( (node, x0, y0, x1, y1) => {
    svg.append("rect")
      .attr("x", x0)
      .attr("y", y0)
      .attr("width", x1-x0)
      .attr("height", y1-y0)
      .style("fill", "none")
      .style("fill-opacity", 0.0)
      .style("stroke", color)
      .style("stroke-width", 0.01);
    return x1 - x0 < 1;
  });
}}

}
);
  main.variable(observer("makeTrees")).define("makeTrees", ["picsize","d3","trees"], function(picsize,d3,trees){return(
function makeTrees() {
  const width = picsize;
  const height = picsize;
  const infoPanel = d3.select("#mytreeinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, 20, 20])
  .style("border", "solid 1px black");
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, 20.0]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([20.0, 0.0]);
  svg.append("g")
    .attr("id", "trees")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.X))
    .attr("cy", d => yScale(d.Y))
    .attr("r", 0.02);
  return {svg: svg, xScale: xScale, yScale: yScale};
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`
<style>
  .selected { fill: red; }
</style>
`
)});
  return main;
}
