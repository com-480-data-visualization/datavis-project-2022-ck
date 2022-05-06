# Milestone 2

Online webpage: [https://com-480-data-visualization.github.io/datavis-project-2022-ck/src/index.html](GitHub Page Link)

## Visualization Description

### Overall Layout
Cryptogram is divided into 4 section. Section 1 is left bar that user can select coin types they want to learn. According to the result that user selected on Section1, the result shown in section 2,3,4 will be changed.

![](https://i.imgur.com/0HKzxER.png)

### Section
#### 1. Coin Types Selection
![](https://i.imgur.com/f0sDSnz.png)

In left bar, users can select coins types that they want to know more about. To prevent the cognitive overload of the user, we only allow them to choose at most 4 coins out of 13 coins : BTC, ETH, XRP, LTC, ADA, BCH, USDT, XMR, TRX, ETC, DASH, ZEC, XTZ. We chose these coins because they are the categories that our news API consist. There are various kind of coins, and each interests also varies a lot. We want to enable the website to interactely reflect user's need. Therefore, the main page will dynamically show customized results according to the input on section 1. 

**Related tools:**
* Multiselect Dropdown List with Checkboxes
    

#### 2. Recent News Information
![](https://i.imgur.com/yT1cIvk.png)
1. Recent News

We will first show several news summaries. For each news, the category is shown on the top left corner with summarized news information. Users can refresh the component when they want to see other news. The news summary will be linked to URL of the news so that user can read the full text.


**Extra Ideas**
If user hover a certain keyword in a wordcloud, it will show some news that keyword is contained the most.

2. Word Cloud

Next, the word cloud extracted from all the body paragraphs of news related to given coin categories are shown. We will further discuss about the range of date contained in the data. We can select among daily, weekly or monthly word cloud.

3. Sentiment Score

Finally, the weekly sentiment score is shown in 2D plot. X-axis is the sentimental score normalized from -1 to 1, and Y-axis is the date. Each point represent the news, and the icon shows the coin category. User can understand the overall sentimental score, and compare sentimental score among different coin categories.

**Extra Ideas**
We can try to integrate price change plot with sentiment plot. The change can be the derivative of the price. For example, it can be interpreted as the price of a coin changes 10% and the corresponding sentiment score becomes more positive.

**Related Tools:**
* NLTK Sentiment Analysis
* D3 word cloud
* D3 scatter plot
* D3 random

#### 3. Price and News 
![](https://i.imgur.com/jLi87M3.png)

For price and news, we have two sub-sections. On the left, there is a plot showing the change of price of the selected coins. Each node represents the price of a coin for a specific day. If the user click on one node, the right section will show the coin's analysis on that day. More specifically, there would be a word cloud of the news, a sentiment score, and a list of all news related to the coin on that day.

Moreover, there is a bar at the bottom to allow the user to choose the range of time. We will always show a 30-day time window and the user can easily choose any interested time window.

**Related d3 tools:**

- Plotting curves
- D3 events
- D3 slider
- Tag cloud

**Extra Ideas**
By using D3 brush, we could add zooming function on the plot as in the example mentioned on the lecture ([link](https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6)). The range of price differs a lot among different coins, so the plot of some coin prices cannot be seen well if we have one strict y-axis range. It would be good if user can easily zoom in the part that they want to see.

#### 4. Comparison between coins
We will also have a part where users can compare different coins and examine the detailed information for selected ones. 

Firstly, we would present a timeline to show the initial release date of the total 13 coins.
![](https://i.imgur.com/E5j4HYd.png)

Then, as with section 1, users can select at most 4 coins to compare. The information includes:
- Price: the closing price of the day.
- Volume: the trading volume over the past week.
- Ranking: the rank of the coin by market capital.
- Position: buy or sell according to the market trend.
- Keywords: most frequent words related to that coin appeared in the news.
For numerical values, users can sort them by ascending or descending order.
![](https://i.imgur.com/GpnaamC.png)


We will also show from year 2019 to 2021, the market value of selected coins and the percentage of each in pie charts.
![](https://i.imgur.com/voAdE9e.png)

Lastly, we will visualize the trading volumn and the amount of transactions on a specified week.
![](https://i.imgur.com/PQQfEIh.png)

**Related d3 tools:**

- Chart.js
- D3 pie chart
- D3 table
- D3 shapes