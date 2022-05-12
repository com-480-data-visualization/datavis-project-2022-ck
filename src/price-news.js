console.log("price-news");

const width = window.innerWidth * 0.6;
const height = width * 0.5;

function refresh_price_plot_url(url, conversor, filter, handler) {
  d3.csv(url, (data) => {
    let data0 = conversor(data);
    if (filter(data0)) handler(data0);
  });
}

function parse_price_data(data) {
  return {
    open: data.open - 0,
    close: data.close - 0,
    high: data.high - 0,
    low: data.low - 0,
    date: new Date(data.date),
  };
}

/**
 *
 * @param {Date} start_date
 * @param {Date} end_date
 * @returns (data) => filter(data)
 */
function range_filter(start_date, end_date) {
  return (data) => {
    const date = new Date(data.date);
    return date >= start_date && date < end_date;
  };
}

/**
 *
 * @param {Array} datas
 * @param {function object => object} mapper
 * Mapper should produce the following values: date, open, high, low, close.
 */
function MultiCandlestick(
  datas,
  mapper,
  width,
  height,
  xDomain,
  yDomain,
  xTicks,
  xPadding = 70,
  opacityTransitionIn = 100,
  opacityTransitionOut = 500,
  opacityLow = 0.3,
  legend_line_width = 50
) {
  let data = datas.map(mapper);
  console.log(data);
  const X = d3.map(data, (d) => d.date);
  const Yo = d3.map(data, (d) => d.open);
  const Yc = d3.map(data, (d) => d.close);
  const Yh = d3.map(data, (d) => d.high);
  const Yl = d3.map(data, (d) => d.low);
  const I = d3.range(X.length);
  const marginTop = 20; // top margin, in pixels
  const marginRight = 30; // right margin, in pixels
  const marginBottom = 30; // bottom margin, in pixels
  const marginLeft = 40; // left margin, in pixels
  const xRange = [marginLeft, width - marginRight - marginLeft];
  const yRange = [height - marginTop, 0];
  const yType = d3.scaleLinear;
  const xFormat = "%b %-d"; // a format specifier for the date on the x-axis
  const yFormat = "~f"; // a format specifier for the value on the y-axis
  const stroke = "currentColor"; // stroke color for the daily rule
  const strokeLinecap = "round"; // stroke line cap for the rules
  const colors = ["#00008B", "#4169E1", "#ADD8E6"]; //
  const yLabel = "price ($)";

  const weeks = (start, stop, stride) => {
    return d3.utcDays(start, stop.setDate(stop.getDate() + 1), stride);
  };

  const xScale = d3
    .scaleTime()
    .domain([d3.min(X), d3.max(X)]) // values between for month of january
    .range([xPadding, width - xPadding * 2]);
  if (xDomain === undefined) xDomain = [d3.min(X), d3.max(X)];
  if (yDomain === undefined) yDomain = [d3.min(Yl) * 0.9, d3.max(Yh)];
  if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 7);
  console.log(xTicks);

  const yScale = yType(yDomain, yRange);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.utcFormat(xFormat))
    .tickValues(xTicks);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  function onClickDate(d, i) {
    console.log(d3.select(this));
    console.log(d3.select(this).attr("data-date"));
  }

  function onMouseOver(i) {
    let coin = d3.select(this).attr("data-coin");
    d3.selectAll(`.coin-${coin},.legend-${coin},.coinopen-${coin}`)
      .transition()
      .duration(opacityTransitionIn)
      .ease(d3.easeLinear)
      .style("opacity", 1.0);
  }

  function onMouseOut(i) {
    let coin = d3.select(this).attr("data-coin");
    d3.selectAll(`.coin-${coin},.legend-${coin}`)
      .transition()
      .duration(opacityTransitionOut)
      .ease(d3.easeLinear)
      .style("opacity", 0);
    d3.selectAll(`.coinopen-${coin}`)
      .transition()
      .duration(opacityTransitionOut)
      .ease(d3.easeLinear)
      .style("opacity", opacityLow);
  }

  const title = "hello-world";

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", width - marginLeft - marginRight)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", marginTop)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );

  // legend
  const legendData = [
    {
      coin: "BTC",
      colors: ["#00008B", "#4169E1", "#ADD8E6"],
    },
  ];

  const legend = svg
    .append("g")
    .attr("transform", `translate(0, ${marginTop})`)
    .data(legendData);

  legendData.forEach((data) => {
    let coin = data.coin;
    let colors = data.colors;
    legend
      .append("line")
      .classed("legend-" + coin, true)
      .attr("x1", width - xPadding - legend_line_width)
      .attr("x2", width - xPadding)
      .attr("stroke-width", 5)
      .style("opacity", 0)
      .attr("stroke", (coin) => {
        return colors[0];
      });

    legend
      .append("line")
      .classed("legend-" + coin, true)
      .attr("x1", width - xPadding - legend_line_width)
      .attr("x2", width - xPadding)
      .attr("stroke-width", 5)
      .style("opacity", 0)
      .attr("transform", (i) => `translate(0,10)`)
      .attr("stroke", (coin) => {
        return colors[1];
      });

    legend
      .append("line")
      .classed("legend-" + coin, true)
      .attr("x1", width - xPadding - legend_line_width)
      .attr("x2", width - xPadding)
      .attr("stroke-width", 5)
      .style("opacity", 0)
      .attr("transform", (i) => `translate(0,20)`)
      .attr("stroke", (coin) => {
        return colors[2];
      });

    legend
      .append("text")
      .classed("legend-" + coin, true)
      .attr("x", width - xPadding + 5)
      .attr("y", 5)
      .style("opacity", 0)
      .style("font-size", "7pt")
      .text(coin + " ↑");

    legend
      .append("text")
      .classed("legend-" + coin, true)
      .attr("x", width - xPadding + 5)
      .attr("y", 15)
      .style("opacity", 0)
      .style("font-size", "7pt")
      .text(coin + " =");

    legend
      .append("text")
      .classed("legend-" + coin, true)
      .attr("x", width - xPadding + 5)
      .attr("y", 25)
      .style("opacity", 0)
      .style("font-size", "7pt")
      .text(coin + " ↓");

    // right tag
    svg
      .append("text")
      .attr("x", width - xPadding + 5)
      .attr("y", yScale(Yo[0]))
      .style("opacity", 1)
      .style("font-size", "10pt")
      .style("fill", colors[1])
      .text(coin)
      .attr("data-coin", (i) => coin)
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut);
  });

  const g = svg
    .append("g")
    .attr("stroke", stroke)
    .attr("stroke-linecap", strokeLinecap)
    .selectAll("g")
    .data(I)
    .join("g")
    .attr("transform", (i) => `translate(${xScale(X[i])},0)`);

  g.append("line")
    .classed("coin-" + "BTC", true)
    .style("opacity", 0)
    .attr("y1", (i) => yScale(Yl[i]))
    .attr("y2", (i) => yScale(Yh[i]));

  g.append("line")
    .attr("y1", (i) => yScale(Yo[i]))
    .attr("y2", (i) => yScale(Yc[i]))
    .attr("stroke-width", 5)
    .attr("stroke", (i) => colors[1 + Math.sign(Yo[i] - Yc[i])])
    .attr("data-coin", (i) => "BTC")
    .attr("data-date", (i) => X[i])
    .style("opacity", 0)
    .classed("coin-" + "BTC", true)
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .on("click", onClickDate);

  const line_gen = d3
    .line()
    .x(function (i) {
      return xScale(X[i]);
    })
    .y(function (i) {
      return yScale(Yo[i]);
    });
  svg
    .append("path")
    .attr("class", "line")
    .classed("coinopen-" + "BTC", true)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("opacity", opacityLow)
    .attr("d", line_gen(I))
    .attr("data-coin", "BTC")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut);

  // circles
  svg
    .selectAll("circles")
    .data(I)
    .enter()
    .append("circle")
    .attr("fill", colors[1])
    .attr("stroke", "none")
    .attr("cx", function (i) {
      return xScale(X[i]);
    })
    .attr("cy", function (i) {
      return yScale(Yo[i]);
    })
    .attr("r", 3)
    .attr("data-coin", (i) => "BTC")
    .attr("data-date", (i) => X[i])
    .on("click", onClickDate);

  if (title) g.append("title").text(title);

  return svg.node();
}

function plot_price(id) {
  return (data) => {
    console.log(data);
    let node = MultiCandlestick(data, (v) => v, width, height);
    console.log(node);
    d3.select("#" + id).append(() => node);
  };
}

function collect(total, callback) {
  let count = 0;
  let data = [];
  return (elem) => {
    data.push(elem);
    count += 1;
    if (count == total) callback(data);
  };
}

let default_start_date = new Date("2022-01-01");
let default_end_date = new Date("2022-01-31");

whenDocumentLoaded(() => {
  refresh_price_plot_url(
    "../cleaned_data/BTC_USD.csv",
    parse_price_data,
    range_filter(default_start_date, default_end_date),
    collect(30, plot_price("price"))
  );
  console.log("loaded");
});

/* reference: https://observablehq.com/@d3/candlestick-chart */
