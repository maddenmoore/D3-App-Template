import * as d3 from "d3";

export function barChart(X: Int32Array, Y: string[]) {
  // Here we use an array of indexes as data for D3 so we can process columnar data more easily
  // but you could also directly pass an array of objects to D3.
  const I = d3.range(X.length);

  const margin = { top: 30, right: 0, bottom: 30, left: 50 };
  const width = 600;
  const height = 300;

  const xRange = [margin.left, width - margin.right];
  const yRange = [margin.top, height - margin.bottom];

  // Construct scales and axes.
  const xScale = d3
    .scaleLinear()
    .domain([0, Math.max(...X)])
    .range(xRange);
  const yScale = d3.scaleBand().domain(Y).range(yRange).padding(0.1);

  const xAxis = d3.axisTop(xScale).ticks(width / 80);
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  // Create the SVG element for the chart.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  // Add the x axis
  svg
    .append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(xAxis)
    // add gridlines
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("y2", height - margin.top - margin.bottom)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", width - margin.right)
        .attr("y", -22)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text("Count →")
    );

  // Add the bars
  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", xScale(0))
    .attr("y", (i) => yScale(Y[i])!)
    .attr("width", (i) => xScale(X[i]) - xScale(0))
    .attr("height", yScale.bandwidth());

  // Add text
  svg
    .append("g")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("text")
    .data(I)
    .join("text")
    .attr("x", (i) => xScale(X[i]))
    .attr("y", (i) => yScale(Y[i])! + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .text((i) => xScale.tickFormat(100, "d")(X[i])!)
    .call((text) =>
      text
        .filter((i) => xScale(X[i]) - xScale(0) < 20) // short bars
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start")
    );

  // Add the y axis
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

  return svg.node()!;
}
