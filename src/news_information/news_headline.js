class NewsHeadLine {
  constructor(selector, coins, start_date, end_date) {
    this.selector = selector;
    this.coins = coins;
    this.start_date = start_date;
    this.end_date = end_date;
    this.news_data = {};
    this.selected_news_idx = {};

    this.div = document.getElementById(this.selector);
  }

  show_news_headline() {
    d3.select("#news-head").selectAll(".news-head-type").remove();
    this.coins.forEach((coin, idx) => {
      // Add div box
      d3.select("#news-head")
        .append("div")
        .classed("news-head-type", true)
        .attr("id", "news-head-" + coin);

      //Add coin type
      d3.select("#news-head-" + coin)
        .append("div")
        .classed("header-box", true)
        .html(this.coin_box_template(coin));

      // Add news-box
      refresh_news_information(
        this.start_date,
        this.end_date,
        [coin],
        url_contain,
        parse_news_data,
        range_news_filter,
        this.save_news(coin)
      );
    });
  }

  save_news(coin) {
    return (data) => {
      this.news_data[coin] = data;
      this.selected_news_idx[coin] = -1;

      this.update_news_box(coin);
    };
  }

  update_news_box(coin) {
    let news_data = this.news_data[coin];
    var idx = Math.floor(Math.random() * news_data.length);
    while (idx == this.selected_news_idx) {
      idx = Math.floor(Math.random() * news_data.length);
    }
    this.selected_news_idx[coin] = idx;

    let news = news_data[idx];

    d3.select("#news-head-" + coin)
      .select(".news-box")
      .remove();
    d3.select("#news-head-" + coin)
      .append("div")
      .classed("news-box", true)
      .style("background-image", `url(${news.imageurl})`)
      .html(
        this.news_box_template(
          coin,
          news.date,
          news.title,
          news.body,
          news.url,
          news.imageurl
        )
      );

    // Add event listener for refresh button
    document.getElementById("refresh-" + coin).onclick = (e) => {
      e.preventDefault();
      this.update_news_box(coin);
    };
  }

  coin_box_template(coin) {
    const src = "./coinIcons/" + coin.toLowerCase() + ".svg";
    return `
    <img src = ${src}></img>
    <h3>${coin_name[coin]}</h3>
    <h3>(${coin})</h3>
    `;
  }

  news_box_template(coin, date, title, body, url, imageurl) {
    date = date.toDateString();

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
        <button class="refresh-button" id="refresh-${coin}"><i class="fa fa-refresh"></i></button>
        
        <h4>${date}</h4>
        <h3 class="text-left" style="font-style: italic;">${title}</h3>
        <hr/>
        <p class="news-box-text">${body2}</p>
      </div>
    </a>
    `;
  }
}
