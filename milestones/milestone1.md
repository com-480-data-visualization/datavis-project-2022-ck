# Milestone 1: Cryptogram

## Dataset

In the project, we use the data source *cryptocompare* [1](https://www.cryptocompare.com/), which provides various information related to crypto-currency and several free APIs to access the data. The main reason
of using this data source is its high quality: most **numeric** data are cleaned and there is no
need to pre-process the dataset for data like price. They also provide daily **news** data which
our text analysis are based on.

The detail of our source data is as follows:

- **Price data** contains the daily price data, including *high, low, open, volumefrom, volumeto,
annd close*, for major crypto-currencies from 2010 to 2022.
- **News data** contains the up-to-date news article information, including *date,
title, body, and image*, from 2013 to 2022. We aggregate the articles by time and by
coin.

You may find our raw data and cleaned data in [raw_data](../raw_data/) and [cleaned_data](../cleaned_data/).

## Problematic

Digitised assets and innovative financial channels are emerging in recent years. The tendency
of the number of financial institutions to include cryptocurrencies in their portfolios has
accelerated [2]. Although many traders and scholars want to know more in this area, the
websites online only contain the information of the price, there lacks an in-dept analysis. Our
website aims to bridge this gap by including related news information. We hope an intuitive
visualization together with updated new could give a better guidance to novices in this field.

The web application we plan to build is called **_Cryptogram_**. It will visualize useful price
information about cryptocurrency and filter informative news related to that. We also provide
functions that users can compare different cryptocurrencies and show the correlations in their
prices.

## Exploratory Data Analysis

### Price

We have **30** different kinds of cryptocurrencies in total, and the trading information of each
of them in **6** different currencies.

For each currency, we have details about *date, highest price, lowest price, open price, close
price, trading volume*. The longest trading history dates back to **2010**, we have the newest
data till **March in 2022**.

### News

The API contains news articles from **2013** to **2022** with **28** categories. There are lots of recent
articles, but there are lack of articles data from 2013 to 2015.

We extracted the most common keyword from the body paragraph article for each day.
Some contains the country name such as *’russia’, ’ukraine’, ’japanese’* which can be used to
predict the relationship between the price and political issue. However, some keywords are
not valuable. Keywords such as *’crypto’, ’price’* are obvious or numbers like *’8750’* will be
represented at price data. We will manually remove too obvious or repeated keywords, to
extract meaningful keywords.

## Related Works

There are other websites showing crypto-currency data, but we are the first one to **integrate**
the **numerical** and **text** data visualization with **corelation analysis**.

- Coin360([https://coin360.com/](https://coin360.com/)) : A website with nice numerical data visualization on
crypto-currencies. Users can easily get the latest price and capacity values. However, it
does not integrate the news data for analysis.

- CoinDesk([https://www.coindesk.com/](https://www.coindesk.com/)) : A website focusing on crypto-currency news.
It provides articles all about crypto-currencies. However, it does not have further text
analysis and interaction between the price and the news.

- BitNodes([https://bitnodes.io/](https://bitnodes.io/)) : A website visualizing the estimated distribution of
BitCoin nodes in the world. However, it does not provide information for other crypto-
currencies and the method may not apply to others.

- TxStreet([https://txstreet.com/v/eth-btc](https://txstreet.com/v/eth-btc)) : A website displaying information of de-
centralized Apps with interesting visualization and interface. However, it does not fit
into our main purpose.

## References

1. *Cryptocompare*: [https://www.cryptocompare.com/](https://www.cryptocompare.com/)
2. Fan Fang et al. *Cryptocurrency trading: a comprehensive survey*. In: Financial Innovation 8.1 (2022),
pp. 1–59.