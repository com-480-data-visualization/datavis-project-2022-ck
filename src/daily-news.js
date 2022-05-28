function update_daily_news(coin, date) {
  hide_daily_news();
  setTimeout(() => {
    update_daily_news_data(coin, date);
    setTimeout(() => {
      show_daily_news(coin, date);
    }, 100);
  }, 100);
}

function hide_daily_news() {
  d3.selectAll("#daily-news-cover").classed("hide", true);
  d3.selectAll("#daily-news")
    .transition()
    .duration(100)
    .ease(d3.easeLinear)
    .style("opacity", 0);
}

function update_daily_news_data(coin, date) {
  document.getElementById("daily-news-title-text-coin").innerHTML = coin;
  document.getElementById("daily-news-title-text-date").innerHTML = new Date(
    date
  ).toLocaleDateString("en-US");

  document.getElementById(
    "daily-news-icon-img"
  ).src = `./coinIcons/${coin.toLowerCase()}.svg`;
  let newDate = new Date(date);

  document.getElementById("prev-date").onclick = () => {
    update_daily_news(coin, newDate.setDate(newDate.getDate() - 1));
  };

  document.getElementById("next-date").onclick = () => {
    update_daily_news(coin, newDate.setDate(newDate.getDate() + 1));
  };
  let startDate = new Date(date);
  let nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  refresh_news_information(
    startDate,
    nextDate,
    [coin],
    url_contain,
    parse_news_data,
    range_news_filter,
    price_news_get_news_handler
  );
}

function show_daily_news(coin, date) {
  d3.selectAll("#daily-news").style("width", "25vw");

  d3.selectAll("#daily-news")
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .style("opacity", 1);

  // show wordcloud
  let newDate = new Date(date);
  let nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  refresh_news_information(
    newDate,
    nextDate,
    [coin],
    url_contain,
    parse_news_data,
    range_news_filter,
    news_info("word-cloud")
  );
}

function price_news_get_news_handler(data) {
  const length = data.length;
  d3.select("#news-list").selectAll("div").remove();

  if (length == 0) {
    d3.select("#news-count").html("0");
    update_sentiment_score(0.0);
    return;
  }
  const sentiment_score_sum = data
    .map((a) => a.sentiment - 0)
    .reduce((a, b) => a + b, 0.0);
  const sentiment_score_avg = sentiment_score_sum / data.length;
  console.log("sentiment avg: " + sentiment_score_avg);

  update_sentiment_score(sentiment_score_avg);

  d3.select("#news-count").html(length);

  data.forEach((d) => news_handler(d));
}

function news_box_template(title, body, url, imageurl) {
  title = title.replace(/[^\x00-\x7F]/g, "");
  const body2 =
    body
      .replace(/[^\x00-\x7F]/g, "")
      .split(" ")
      .slice(0, 30)
      .join(" ") + " ...";
  return `
  <a href="${url}" target="_blank">
    <div class="foreground" style="padding: 10px">
      <h3 class="text-left" style="font-style: italic;">${title}</h3>
      <hr/>
      <p class="news-box-text">${body2}</p>
    </div>
  </a>
  `;
}

function news_handler(news) {
  d3.select("#news-list")
    .append("div")
    .classed("news-box", true)
    .style("background-image", `url(${news.imageurl})`)
    .html(news_box_template(news.title, news.body, news.url, news.imageurl));
}

// sentiment-score

function update_sentiment_score(new_score) {
    newGauge.update(new_score);
}

var gauge = function(container, width, margin) {
    var that = {};

    /* value: -1 ~ 1 */
    function update(value) {
        var text = `Sentiment score: ${value.toFixed(2)}`;
        var data = Array.from({length: 360}, (x, i) => i/360);
    
        // Settings
        var height = width*0.75
        var anglesRange = 0.5 * Math.PI
        var radis = Math.min(width, 2 * height) / 2
        var thickness = width*0.15;
        // Utility
        var gradientColor1 = d3.interpolateHslLong("#12c2e9", "#c471ed");
        var gradientColor2 = d3.interpolateHslLong("#c471ed", "#f64f59");
        var colors = data.map(x => {
            if (x<0.5) return gradientColor1(x*2)
            else return gradientColor2(x*2-1);
        }
        );

        var pies = d3.layout.pie()
            .value(d => d)
            .sort(null)
            .startAngle( anglesRange * -1)
            .endAngle( anglesRange)
        
            var arc = d3.arc()
            .outerRadius(radis)
            .innerRadius(radis - thickness)
        
        var translation = (x, y) => `translate(${x}, ${y})`
        
        // Feel free to change or delete any of the code you see in this editor!
        d3.select(container).selectAll("svg").remove();
        var svg = d3.select(container).append("svg")
            .attr("width", width+2*margin)
            .attr("height", height+2*margin)
            .attr("class", "half-donut")
        var g = svg.append("g")
            .attr("transform", translation(width / 2 + margin, height + margin))
        
        g.selectAll("path")
            .data(pies(data))
            .enter()
            .append("path")
            .attr("fill", (d, i) => colors[i])
            .attr("d", arc)
        
        g.append("text")
            .text( d => text)
            .attr("dy", `${-height + 20}`)
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("font-weight", "lighter");
        
        g.append("text")
            .text( d => "-1")
            .attr("dy", `${-margin*0.5}`)
            .attr("dx", `${-width/2 + thickness + margin*2}`)
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("font-weight", "lighter");
                    
        g.append("text")
        .text( d => "1")
        .attr("dy", `${-margin*0.5}`)
        .attr("dx", `${width/2 - thickness - margin*2}`)
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("font-weight", "lighter");

        var needle = svg
            .append("g")
            .attr("class", "needle")
            .attr("transform", `translate(${margin},${width*0.15 + margin})`)
            .append("path")
            .attr("class", "tri")
            .attr("d", "M" + (width/2 + 2) + " " + (120 + 10) + " L" + width/2 + " 0 L" + (width/2 - 3) + " " + (120 + 10) + " C" + (width/2 - 3) + " " + (120 + 20) + " " + (width/2 + 3) + " " + (120 + 20) + " " + (width/2 + 3) + " " + (120 + 10) + " Z")
            .attr("transform", `rotate(-90, ${width/2}, ${width*0.15})`);

        function turnNeedle(newValue)
            {
                needle
                .transition()
                .duration(1000)
                .attrTween("transform", tween);
                function tween(d, i, a) {
                    return d3.interpolateString(`rotate(-90, ${width/2}, ${height*0.75})`, `rotate(${90*newValue}, ${width/2}, ${height*0.75})`);
                }
            }
        turnNeedle(value);
    }
    that.update = update;
    return that;
};

// d3.select("#sentiment-score").selectAll("div").remove();
let newGauge = gauge("#sentiment-score", window.innerWidth*0.12, 10);
