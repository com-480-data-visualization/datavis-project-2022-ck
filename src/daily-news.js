function update_daily_news(coin, date) {
    hide_daily_news();
    setTimeout(() => {
        update_daily_news_data(coin, date);
        setTimeout(() => {
            show_daily_news();
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
}

function show_daily_news() {
    d3.selectAll("#daily-news")
        .style("width", "25vw");
    d3.selectAll("#daily-news")
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .style("opacity", 1);
}