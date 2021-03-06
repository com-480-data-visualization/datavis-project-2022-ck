/**
 * @param {Date} start_date
 * @param {Date} end_date
 * @param {Array[String]} coins : ex) ['BTC', 'ETH', ...]
 **/
function refresh_news_information(
  start_date,
  end_date,
  coins,
  getUrl,
  conversor,
  filter,
  handler
) {
  let cnt = 0;
  let data1 = [];

  let urls = getUrl(start_date, end_date);
  urls.forEach((url) => {
    d3.csv(url, (data) => {
      let data0 = conversor(data);
      if (filter(start_date, end_date, coins)(data0)) return data0;
    }).then(function (data) {
      cnt++;
      data.forEach((d) => data1.push(d));
      if (cnt == urls.length) handler(data1);
    });
  });
}

function url_contain(start_date, end_date) {
  let start_year = start_date.getFullYear();
  let end_year = end_date.getFullYear();

  let urls = [];
  for (let year = start_year; year <= end_year; year++) {
    urls.push(`../cleaned_data/news/news_${year}.csv`);
  }
  return urls;
}

function parse_news_data(data) {
  return {
    date: new Date(data.date),
    id: data.id,
    title: data.title,
    body: data.body,
    url: data.url,
    imageurl: data.imageurl,
    categories: data.categories,
    keywords: data.keywords,
    sentiment: data.sentiment,
  };
}

/**
 * @param {Date} start_date
 * @param {Date} end_date
 * @returns (data) => filter(data)
 **/

function range_news_filter(start_date, end_date, coins) {
  return (data) => {
    const date = new Date(data.date);
    const categories = data.categories.split("|");
    var coin_include = false;
    for (var i = 0; i < coins.length; i++) {
      if (categories.includes(coins[i])) {
        coin_include = true;
        break;
      }
    }
    return date >= start_date && date < end_date && coin_include;
  };
}

// let cloud_width = 200,
//   cloud_height = 200,
//   max_font_size = 20,
//   min_font_size = 10,
//   multi_font_size = 2;

let cloud_width = window.innerWidth*0.11,
  cloud_height = cloud_width,
  max_font_size = 20,
  min_font_size = 10,
  multi_font_size = 2;

function wordCloud(selector, words, max_word) {
  if (words.length == 0) {
    words.push({
      categories: "",
      keywords: "no news today no news today no news today no news today"
    })
  }
  words = freqDict(words, max_word);

  var fill = d3.scale.category20();

  //Construct the word cloud's SVG element

  d3.select("#" + selector)
    .selectAll("svg")
    .selectAll("g")
    .remove();

  var svg = d3
    .select("#" + selector)
    .selectAll("svg")
    .attr("width", cloud_width)
    .attr("height", cloud_height)
    .append("g");

  //Draw the word cloud
  function draw(words) {
    var cloud = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words);

    cloud
      .enter()
      .append("text")
      .style("font-family", "Impact")
      .style("fill", function (d, i) {
        return fill(i);
      })
      .attr("text-anchor", "middle")
      .style("font-size", 1)
      .text(function (d) {
        return d.text;
      })
      .transition()
      .duration(1000)
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .style("fill-opacity", 1);

    //Exiting words
    cloud
      .exit()
      .transition()
      .duration(200)
      .style("fill-opacity", 1e-6)
      .attr("font-size", 1)
      .remove();
  }

  var layout = d3.layout
    .cloud()
    .size([cloud_width, cloud_height])
    .words(words)
    .padding(1)
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .font("Impact")
    .fontSize(function (d) {
      return d.size;
    })
    .on("end", draw);
  layout.start();
}

// reference: http://bl.ocks.org/joews/9697914

function freqDict(data) {
  var counter = {};
  var category_counter = {};

  data.forEach((value) => {
    let keywords = value.keywords.replace(/???()??????',[!\.,:;\?]/g, "").split(" ");

    let categories = value.categories.split("|");
    keywords.forEach((value) => {
      categories.forEach((category) => {
        if (category in category_counter) category_counter[category] += 1;
        else category_counter[category] = 1;

        if (value in counter) {
          if (category in counter[value]) counter[value][category] += 1;
          else counter[value][category] = 1;
        } else {
          counter[value] = {};
          counter[value][category] = 1;
        }
      });
      if ("size" in counter[value]) counter[value]["size"] += 1;
      else counter[value]["size"] = 1;
    });
  });

  Object.entries(counter).forEach(([keyword, value]) => {
    Object.entries(value).forEach(([coin, cnt]) => {
      if (coin != "size") {
        counter[keyword][coin] = (cnt / category_counter[coin]) * 100;
      }
    });
  });
  var words = [];

  Object.entries(counter).forEach(([key, value]) => {
    words.push({
      text: key,
      size: value.size * multi_font_size + min_font_size,
      category: value,
      count: value.size,
    });
  });
  return words;
}

function news_info(id) {
  return (data) => {
    wordCloud(id, data);
  };
}
