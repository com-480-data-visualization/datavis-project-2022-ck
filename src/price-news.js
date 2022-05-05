console.log("price-news");

const width = window.innerWidth * 0.6;
const height = width * 0.5;

function refresh_price_plot_url(url, conversor, filter, handler) {
    d3.csv(url,
        data => {
            let data0 = conversor(data);
            if (filter(data0)) handler(data0)
        })
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
        return data.date >= start_date && data.date < end_date;
    };
}


/**
 * 
 * @param {Array} datas 
 * @param {function object => object} mapper
 * Mapper should produce the following values: date, open, high, low, close. 
 */
function MultiCandlestick(datas, mapper, width, height, xDomain, yDomain, xTicks, xPadding = 0.2) {
    let data = datas.map(mapper);
    console.log(data);
    const X = d3.map(data, d => d.date);
    const Yo = d3.map(data, d => d.open);
    const Yc = d3.map(data, d => d.close);
    const Yh = d3.map(data, d => d.high);
    const Yl = d3.map(data, d => d.low);
    const I = d3.range(X.length);
    const marginTop = 20; // top margin, in pixels
    const marginRight = 30; // right margin, in pixels
    const marginBottom = 30; // bottom margin, in pixels
    const marginLeft = 40; // left margin, in pixels
    const xRange = [0, width];
    const yRange = [0, height];
    const yType = d3.scaleLinear;
    const xFormat = "%b %-d"; // a format specifier for the date on the x-axis
    const yFormat = "~f"; // a format specifier for the value on the y-axis
    const stroke = "currentColor"; // stroke color for the daily rule
    const strokeLinecap = "round"; // stroke line cap for the rules
    const colors = ["#4daf4a", "#999999", "#e41a1c"]; //
    const yLabel = "price ($)";

    const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop + 1);
    const weekdays = (start, stop) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

    if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
    if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
    if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    const title = "hello-world";

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

    // svg.append("g")
    //     .attr("transform", `translate(${marginLeft},0)`)
    //     .call(yAxis)
    //     .call(g => g.select(".domain").remove())
    //     .call(g => g.selectAll(".tick line").clone()
    //         .attr("stroke-opacity", 0.2)
    //         .attr("x2", width - marginLeft - marginRight))
    //     .call(g => g.append("text")
    //         .attr("x", -marginLeft)
    //         .attr("y", 10)
    //         .attr("fill", "currentColor")
    //         .attr("text-anchor", "start")
    //         .text(yLabel));

    // const g = svg.append("g")
    //     .attr("stroke", stroke)
    //     .attr("stroke-linecap", strokeLinecap)
    //     .selectAll("g")
    //     .data(I)
    //     .join("g")
    //     .attr("transform", i => `translate(${xScale(X[i])},0)`);

    // g.append("line")
    //     .attr("y1", i => yScale(Yl[i]))
    //     .attr("y2", i => yScale(Yh[i]));

    // g.append("line")
    //     .attr("y1", i => yScale(Yo[i]))
    //     .attr("y2", i => yScale(Yc[i]))
    //     .attr("stroke-width", xScale.bandwidth())
    //     .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

    // if (title) g.append("title")
    // .text(title);

    return svg.node();
}

function plot_price(id) {
    return (data) => {
        console.log(data);
        let node = MultiCandlestick(data, v => v, width, height);
        console.log(node);
        let block = d3.select("#" + id).append(() => node);
    }
}

function collect(total, callback) {
    let count = 0;
    let data = [];
    return (elem) => {
        data.push(elem);
        count += 1;
        console.log(count, total);
        if (count == total) callback(data);
    }
}


let default_start_date = new Date("2022-01-01");
let default_end_date = new Date("2022-01-31");

refresh_price_plot_url("../cleaned_data/BTC_USD.csv",
    parse_price_data,
    range_filter(default_start_date, default_end_date),
    collect(30, plot_price("price"))
);

/* reference: https://observablehq.com/@d3/candlestick-chart */