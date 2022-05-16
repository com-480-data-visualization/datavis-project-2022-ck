/**
 * Bugs:
 * 1. We have different yAxis => different horizontal lines.
 * 
 * TODOs:
 */

const coin_colors = {
  BTC: ['#FFA500', '#FFD700', '#BDB76B'],
  ETH: ["#00008B", "#4169E1", "#ADD8E6"],
  default: ['#800080', '#FF00FF', '	#FF69B4']
};

const width = window.innerWidth * 0.6;
const height = width * 0.5;

function refresh_price_plot_url(url, conversor, filter, handler) {
  d3.csv(url, (data) => {
    let data0 = conversor(data);
    if (filter(data0)) {
      handler(data0);
    }
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
 * @param {svg} the svg frame to plot
 * @param {Array} datas
 * @param {function object => object} mapper
 * Mapper should produce the following values: date, open, high, low, close.
 */
function MultiCandlestick(
  svg,
  datas,
  coin,
  mapper,
  width,
  height,
  currency = "",
  xDomain,
  yDomain,
  xTicks,
  xPadding = 70,
  opacityTransitionIn = 100,
  opacityTransitionOut = 1000,
  opacityLow = 0.3,
  legend_line_width = 50,
) {
  let data = datas.map(mapper);

  const X = d3.map(data, (d) => d.date);
  const Yo = d3.map(data, (d) => d.open);
  const Yc = d3.map(data, (d) => d.close);
  const Yh = d3.map(data, (d) => d.high);
  const Yl = d3.map(data, (d) => d.low);
  const I = d3.range(X.length);
  const marginTop = 20; // top margin, in pixels
  const marginRight = 30; // right margin, in pixels
  const marginBottom = 30; // bottom margin, in pixels
  const marginLeft = 55; // left margin, in pixels
  const xRange = [marginLeft, width - marginRight - marginLeft];
  const yRange = [height - marginTop, 0];
  const yType = d3.scaleLinear;
  const xFormat = "%b %-d %Y"; // a format specifier for the date on the x-axis
  const yFormat = "~f"; // a format specifier for the value on the y-axis
  const stroke = "currentColor"; // stroke color for the daily rule
  const strokeLinecap = "round"; // stroke line cap for the rules
  const colors = coin_colors[coin] || coin_color.default; //
  const yLabel = `price (${currency})`;

  const weeks = (start, stop, stride) => {
    let stop2 = new Date(stop);
    return d3.utcDays(start, stop2.setDate(stop.getDate() + 1), stride);
  };

  const xScale = d3
    .scaleTime()
    .domain([d3.min(X), d3.max(X)]) // values between for month of january
    .range([xPadding, width - xPadding - marginRight]);
  if (xDomain === undefined) xDomain = [d3.min(X), d3.max(X)];
  if (yDomain === undefined) yDomain = [d3.min(Yl)*0.9, d3.max(Yh)*1.1];
  if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 7);

  const yScale = yType(yDomain, yRange);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.utcFormat(xFormat))
    .tickValues(xTicks);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  function onClickDate(d, i) {
    alert(d3.select(this).attr("data-coin") + " " + d3.select(this).attr("data-date"));
  }

  let onMouseOver = (i) => {
    d3.selectAll(`*[class*=coin]`)
      .transition()
      .duration(opacityTransitionIn)
      .ease(d3.easeLinear)
      .style("opacity", 0);
    d3.selectAll(`.coin-${coin},.legend-${coin},.yaxis-${coin}`)
      .transition()
      .duration(opacityTransitionIn)
      .ease(d3.easeLinear)
      .style("opacity", 1.0);
  }

  function onMouseOut(i) {
    let coin = d3.select(this).attr("data-coin");
    d3.selectAll(`.coin-${coin},.legend-${coin},.yaxis-${coin}`)
      .transition()
      .duration(opacityTransitionOut)
      .ease(d3.easeLinear)
      .style("opacity", 0);
    d3.selectAll(`*[class*=coinopen]`)
      .transition()
      .duration(opacityTransitionOut)
      .ease(d3.easeLinear)
      .style("opacity", opacityLow);
  }

  const title = "hello-world";

  // legend
  const coin_color = [colors];

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => {
      g.select(".domain").remove();
      g.selectAll("text").attr("font-size", "10pt").attr("font-weight", "lighter")
    });

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(yAxis)
    .call((g) => {
      g.selectAll("text").classed(`yaxis-${coin}`, true);
      g.selectAll("text").attr("opacity", 0);
      g.select(".domain").remove();
    })
    .call((g) =>{
      g
      .selectAll(".tick line")
      .clone()
      .attr("stroke-opacity", 0.2)
      .attr("x2", width - marginLeft - marginRight)
    })
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .classed(`yaxis-${coin}`, true)
        .attr("opacity", 0)
        .attr("font-size", "8pt")
        .text(yLabel)
    );

  const legend = svg
    .append("g")
    .attr("transform", `translate(0, ${marginTop})`)
    .data(coin_color);

  coin_color.forEach((data) => {
    let colors = data;
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
      .style("font-size", "9pt")
      .text(coin + " ↑");

    legend
      .append("text")
      .classed("legend-" + coin, true)
      .attr("x", width - xPadding + 5)
      .attr("y", 15)
      .style("opacity", 0)
      .style("font-size", "9pt")
      .text(coin + " =");

    legend
      .append("text")
      .classed("legend-" + coin, true)
      .attr("x", width - xPadding + 5)
      .attr("y", 25)
      .style("opacity", 0)
      .style("font-size", "9pt")
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
    .classed(`coin-${coin}`, true)
    .style("opacity", 0)
    .attr("y1", (i) => yScale(Yl[i]))
    .attr("y2", (i) => yScale(Yh[i]))

  g.append("line")
    .attr("y1", (i) => yScale(Yo[i]))
    .attr("y2", (i) => yScale(Yc[i]))
    .attr("stroke-width", 5)
    .attr("stroke", (i) => colors[1 + Math.sign(Yo[i] - Yc[i])])
    .attr("data-coin", (i) => `${coin}`)
    .attr("data-date", (i) => X[i])
    .style("opacity", 0)
    .classed(`coin-${coin}`, true)
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
    .classed(`coinopen-${coin}`, true)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("opacity", opacityLow)
    .attr("d", line_gen(I))
    .attr("data-coin", `${coin}`)
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut);

  // circles
  svg
    .selectAll("circles")
    .data(I)
    .enter()
    .append("circle")
    .classed(`coinopen-${coin}`, true)
    .attr("fill", colors[1])
    .attr("stroke", "none")
    .attr("cx", function (i) {
      return xScale(X[i]);
    })
    .attr("cy", function (i) {
      return yScale(Yo[i]);
    })
    .attr("r", 3)
    .attr("data-coin", (i) => `${coin}`)
    .attr("data-date", (i) => X[i])
    .on("click", onClickDate);
}

function create_price_news_svg(title) {
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  svg.append("title").text(title);
  return svg;
}

function plot_price(svg, coin, currency) {
  return (data) => {
    MultiCandlestick(svg, data, coin, (v) => v, width, height, currency);
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

function price_news_plot(coins, currency = "USD", date_start = new Date("2022-01-01"), date_end = new Date("2022-01-31")) {
  let days = Math.round((date_end-date_start)/1000/3600/24);
  const title = `Analysis of ${coins.join(" ")}`;
  let price_news_svg = create_price_news_svg(title);
  let num_data = coins.length;
  let closure = waitN(num_data, () => {
    d3.select("#price").append(() => price_news_svg.node());
    document.getElementById("price-news-title").innerHTML = title;
  });
  
  coins.forEach(function(coin) {
    refresh_price_plot_url(
      `../cleaned_data/${coin}_${currency}.csv`,
      parse_price_data,
      range_filter(date_start, date_end),
      collect(days, function(data) {
        plot_price(price_news_svg, coin, currency)(data);
        closure();
      })
    );
  })
} 

function waitN(N, handler) {
  let n = N;
  return () => {
    n -= 1;
    if (n == 0) handler();
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  price_news_plot(["BTC", "ETH"], "USD")
})



/* reference: https://observablehq.com/@d3/candlestick-chart */