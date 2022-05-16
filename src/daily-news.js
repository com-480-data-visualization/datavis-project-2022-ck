function update_daily_news(coin, date) {
    document.getElementById("daily-news-cover").classList.add("hide");
    document.getElementById("daily-news").classList.remove("hide");
    document.getElementById("daily-news-title-text-coin").innerHTML = coin;
    document.getElementById("daily-news-title-text-date").innerHTML = new Date(date).toLocaleDateString("en-US");

    document.getElementById("daily-news-icon-img").src = `./coinIcons/${coin.toLowerCase()}.svg`;
    console.log(`./coinIcons/${coin.toLowerCase()}.svg`);
}