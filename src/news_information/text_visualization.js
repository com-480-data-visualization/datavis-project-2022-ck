class TextVisualization {
  constructor(selector, coins, start_date, end_date) {
    this.selector = selector;
    this.coins = coins;
    this.start_date = start_date;
    this.end_date = end_date;

    this.width = window.innerWidth * 0.9;
    this.height = 500;
    this.radius = 1;

    this.colors = coin_color;

    this.scaleAngle = d3
      .scaleLinear()
      .domain([0, this.coins.length])
      .range([0, 2 * Math.PI]);

    this.vectors = {};
    this.coins.forEach((coin, idx) => {
      let x = (this.width / 2) * Math.sin(this.scaleAngle(idx + 0.5));
      let y = -(this.height / 2) * Math.cos(this.scaleAngle(idx + 0.5));
      this.vectors[coin] = { x: x, y: y };
    });
    this.showTextVisualization = this.showTextVisualization.bind(this);
    this.initialize();
  }

  initialize() {
    d3.select("#" + this.selector)
      .selectAll("svg")
      .selectAll("g")
      .remove();

    this.svg = d3
      .select("#" + this.selector)
      .select("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

    this.drawCircle();
  }
  drawCircle() {
    this.coins.forEach((val, idx) => {
      var arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(5)
        .startAngle(this.scaleAngle(idx))
        .endAngle(this.scaleAngle(idx + 1));

      this.svg
        .append("path")
        .attr("id", "arc_" + val)
        .attr("class", "arc")
        .attr("d", arc)
        .attr("transform", `scale(${this.width / 2}, ${this.height / 2})`)
        .attr("fill", this.colors[val])
        .style("opacity", 0.8);
    });
  }

  drawText() {
    var svg = this.svg;
    return (data) => {
      var words = freqDict(data);
      words.sort((a, b) => b.count - a.count);

      const max_num = 50;
      words = words.slice(0, max_num);

      let font_size = d3
        .scaleLinear()
        .domain([d3.min(words, (d) => d.count), d3.max(words, (d) => d.count)])
        .range([20, 50]);

      words = words.map((val, idx) => {
        let [ratio, position] = this.compute_position(val.category);
        return {
          text: val.text,
          size: font_size(val.count),
          x: position.x,
          y: position.y,
          id: val.id,
          ratio: ratio,
        };
      });

      if (this.coins.length == 1) {
        this.draw_text_one(words);
      } else {
        this.draw_text_multi(words);
      }

      // Mouse Hovering
      words.forEach((word) => {
        let id = "#wordcloud_" + word.text;
        svg
          .selectAll(id)
          .on("mouseover", (d, i) => {
            d3.select(id)
              .transition()
              .duration("50")
              .style("opacity", 1)
              .style("cursor", "pointer");
            d3.select(id).select("text").style("background", "white");
          })
          .on("mouseout", (d, i) => {
            d3.select(id).transition().duration("50").style("opacity", 0.8);
          });
      });
    };
  }

  draw_text_multi(words) {
    var cloud = this.svg
      .selectAll("g")
      .data(words)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .attr("id", function (d) {
        return "wordcloud_" + d.text;
      })
      .style("opacity", 0.8);

    // Add Text
    cloud
      .append("text")
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.text;
      })
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("fill", "white");

    // Add horizontal bar
    words.forEach((word) => {
      const stack_data = d3.stack().keys(this.coins)([word.ratio]);
      let word_g = this.svg.selectAll("#wordcloud_" + word.text);
      let width = word_g.select("text").node().getBoundingClientRect().width;
      word_g
        .append("g")
        .selectAll("g")
        .data(stack_data)
        .enter()
        .append("rect")
        .attr("fill", (d) => this.colors[d.key])
        .attr("x", (d) => d[0][0] * width - width / 2)
        .attr("y", 0)
        .attr("width", (d) => (d[0][1] - d[0][0]) * width)
        .attr("height", 5);
    });

    // Prevent Overlap
    function getPosition(element) {
      let position = {};
      let string = element.attr("transform");
      let translate = string
        .substring(string.indexOf("(") + 1, string.indexOf(")"))
        .split(",");

      let pos = element.node().getBoundingClientRect();
      position["left"] = parseFloat(translate[0]);
      position["top"] = parseFloat(translate[1]);
      position["right"] = position["left"] + pos.width;
      position["bottom"] = position["top"] + pos.height;
      return position;
    }
    for (var i = 0; i < 10; i++) {
      words.forEach((word, idx) => {
        var self = d3.select("#wordcloud_" + word.text);
        var a;
        for (var j = 0; j < idx; j++) {
          var that = d3.select("#wordcloud_" + words[j].text);
          var b = getPosition(that);
          a = getPosition(self);
          while (
            !(
              b.left > a.right ||
              b.right < a.left ||
              b.top > a.bottom ||
              b.bottom < a.top
            )
          ) {
            // move text
            a = getPosition(self);
            let dx = Math.random() * 10 - 5;
            let dy = Math.random() * 10 - 5;
            self.attr("transform", `translate(${a.left + dx}, ${a.top + dy})`);
          }
        }
      });
    }
  }

  draw_text_one(words) {
    let svg = this.svg;
    function draw(words) {
      var cloud = svg.append("g").selectAll("text").data(words);

      cloud
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .attr("id", function (d) {
          return "wordcloud_" + d.text;
        })
        .text(function (d) {
          return d.text;
        })
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("opacity", 0.8);
    }
    var layout = d3.layout
      .cloud()
      .size([this.width, this.height])
      .words(words)
      .padding(2)
      .rotate(function () {
        return 0;
      })
      .font("Impact")
      .fontSize(function (d) {
        return d.size;
      })
      .on("end", draw);
    layout.start();
  }
  compute_position(category) {
    let data = {};
    var sum = 0;
    this.coins.forEach((coin, idx) => {
      var val = category[coin] || 0;
      data[coin] = val;
      sum += val;
    });

    this.coins.forEach((coin) => {
      data[coin] /= sum;
    });

    let position = { x: 0, y: 0 };
    this.coins.forEach((coin) => {
      let vector = this.vectors[coin];
      position.x += vector.x * data[coin];
      position.y += vector.y * data[coin];
    });

    let n = 0.75;
    position.x *= n;
    position.y *= n;

    return [data, position];
  }

  showTextVisualization() {
    refresh_news_information(
      this.start_date,
      this.end_date,
      this.coins,
      url_contain,
      parse_news_data,
      range_news_filter,
      this.drawText()
    );
  }
}
