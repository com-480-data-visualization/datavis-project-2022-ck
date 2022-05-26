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
    document.getElementById("daily-news-title-text-date").innerHTML = new Date(date).toLocaleDateString("en-US");

    document.getElementById("daily-news-icon-img").src = `./coinIcons/${coin.toLowerCase()}.svg`;
    let newDate = new Date(date);
    
    document.getElementById("prev-date").onclick = () => {
        update_daily_news(coin, newDate.setDate(newDate.getDate() - 1))
    };

    document.getElementById("next-date").onclick = () => {
        update_daily_news(coin, newDate.setDate(newDate.getDate() + 1))
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
    d3.selectAll("#daily-news")
        .style("width", "25vw");
    
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
        d3.select("#sentiment-score").html("TODO: " + 0);
        d3.select("#news-count").html("0");
        return;
    }
    const sentiment_score_sum = data.map(a => a.sentiment-0).reduce((a, b) => a+b, 0.0);
    const sentiment_score_avg = sentiment_score_sum / data.length;
    console.log("sentiment avg: " + sentiment_score_avg);
    d3.select("#sentiment-score").html("TODO: " + sentiment_score_avg.toFixed(2));
    d3.select("#news-count").html(length);

    data.forEach(d => news_handler(d));
}

function news_box_template(title, body, url, imageurl) {
  title = title.replace(/[^\x00-\x7F]/g, "");
  const body2 = body.replace(/[^\x00-\x7F]/g, "").split(" ").slice(0, 30).join(" ") + " ...";
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
  d3.select("#news-list").append("div").classed("news-box", true)
    .style("background-image", `url(${news.imageurl})`)
    .html(news_box_template(news.title, news.body, news.url, news.imageurl));
}
