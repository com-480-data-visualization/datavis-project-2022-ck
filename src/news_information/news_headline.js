class NewsHeadLine {
  constructor(selector, coins, start_date, end_date) {
    this.selector = selector;
    this.coins = coins;
    this.start_date = start_date;
    this.end_date = end_date;

    this.div = document.getElementById(this.selector);

    this.updateHeadline = this.updateHeadline.bind(this);

    this.updateHeadline();
  }

  updateHeadline() {
    this.div.innerHTML = "";
    this.coins.forEach((coin, idx) => {
      refresh_news_information(
        this.start_date,
        this.end_date,
        [coin],
        url_contain,
        parse_news_data,
        range_news_filter,
        this.showHeadlines(coin)
      );
    });
  }

  showHeadlines(coin) {
    return (data) => {
      let data0 = data[data.length - 1];

      let new_div = document.createElement("div");
      new_div.className = "news_headline";

      let flex_div1 = document.createElement("div");
      flex_div1.id = "flex_div_1";

      let coin_info_div = document.createElement("div");
      coin_info_div.id = "header";

      let coin_icon = document.createElement("img");
      coin_icon.id = "coin";
      coin_icon.src = "./coinIcons/" + coin.toLowerCase() + ".svg";

      let coin_name = document.createElement("p");
      coin_name.textContent = coin;

      let date = document.createElement("p");
      let d = new Date(data0.date);
      date.textContent = `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;

      coin_info_div.appendChild(coin_icon);
      coin_info_div.appendChild(coin_name);
      coin_info_div.appendChild(date);

      flex_div1.appendChild(coin_info_div);

      let img = document.createElement("img");
      img.id = "news_image";
      img.src = data0.imageurl;
      flex_div1.appendChild(img);

      let flex_div2 = document.createElement("div");
      flex_div2.id = "flex_div_2";

      let title = document.createElement("a");
      title.innerText = data0.title;
      title.href = data0.url;
      flex_div2.appendChild(title);

      let body = document.createElement("p");
      body.innerText = data0.body;
      flex_div2.appendChild(body);

      new_div.appendChild(flex_div1);
      new_div.appendChild(flex_div2);

      this.div.appendChild(new_div);
    };
  }
}
