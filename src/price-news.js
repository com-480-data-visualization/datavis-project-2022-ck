console.log("price-news");

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

let default_start_date = new Date("2022-01-01");
let default_end_date = new Date("2022-01-30");

refresh_price_plot_url("../cleaned_data/BTC_USD_4242.csv",
    parse_price_data,
    range_filter(default_start_date, default_end_date),
    console.log
);