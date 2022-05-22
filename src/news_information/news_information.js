function refresh_news_information(
  start_date,
  end_date,
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
      if (filter(start_date, end_date)(data0)) return data0;
    }).then(function (data) {
      cnt++;
      data.forEach((d) => data1.push(d));
      if (cnt == urls.length) handler(data1);
    });
  });
}

function url_contain(start_date, end_data) {
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
  };
}

/**
 * @param {Date} start_date
 * @param {Date} end_date
 * @returns (data) => filter(data)
 **/

function range_filter(start_date, end_date) {
  return (data) => {
    const date = new Date(data.date);
    return date >= start_date && date < end_date;
  };
}

let cloud_width = 1000,
  cloud_height = 300,
  max_font_size = 40;

function wordCloud(selector, words) {
  var fill = d3.scale.category20();

  //Construct the word cloud's SVG element
  var svg = d3
    .select("#" + selector)
    .append("svg")
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
    .padding(2)
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
  data.forEach((value) => {
    let sentence = value.keywords.replace(/‘()’’',[!\.,:;\?]/g, "").split(" ");
    sentence.forEach((value) => {
      if (!(value in counter)) counter[value] = 1;
      else counter[value] += 1;
    });
  });
  var words = [];
  Object.entries(counter).forEach(([key, value]) => {
    words.push({ text: key, size: 10 + value * 10 });
  });
  return words;
}

function news_info(id) {
  return (data) => {
    wordCloud(id, freqDict(data));
  };
}

let start_date = new Date("2021-12-31");
let end_date = new Date("2022-01-02");

refresh_news_information(
  start_date,
  end_date,
  url_contain,
  parse_news_data,
  range_filter,
  news_info("today")
);
