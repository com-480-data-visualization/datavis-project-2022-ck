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
        .style("opacity", 0.7);

      let dx = 0;
      if (this.vectors[val].x > 1) dx = -1;
      else if (this.vectors[val].x < -1) dx = 1;

      let vectors = this.vectors[val];
      this.svg
        .append("text")
        .text(val)
        .style("fill", this.colors[val])
        .style("font-family", "Impact")
        .style("font-size", 50)
        .attr("dx", function (d) {
          return vectors.x * 0.9 - this.getComputedTextLength() / 2;
        })
        .attr("dy", vectors.y * 0.9 + 25);
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
      .style("font-family", '"Roboto Condensed", sans-serif')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.text;
      })
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("fill", "white");

    // Add horizontal bar
    words.forEach((word, idx) => {
      const stack_data = d3.stack().keys(this.coins)([word.ratio]);
      let word_g = this.svg.selectAll("#wordcloud_" + word.text);

      var rect = word_g.node().getBoundingClientRect();
      var width = rect.width;
      word_g
        .append("g")
        .selectAll("g")
        .data(stack_data)
        .enter()
        .append("rect")
        .attr("fill", (d) => this.colors[d.key])
        .attr("x", (d) => d[0][0] * width - width / 2)
        .attr("y", (d) => 5)
        .attr("width", (d) => (d[0][1] - d[0][0]) * width)
        .attr("height", 5);
    });

    // Prevent Overlap

    var startTime = new Date();
    var keepCalling = true;
    words.forEach((word, idx) => {
      var self = d3.select("#wordcloud_" + word.text);
      var iteration = 0;
      while (keepCalling && this.collide(self, words.slice(0, idx))) {
        if (new Date().getTime() - startTime.getTime() > 5000) {
          keepCalling = false;
        }

        this.move_text(self, iteration);
        iteration += 1;
      }
    });
  }

  get_position(element) {
    let position = {};
    let string = element.attr("transform");
    let translate = string
      .substring(string.indexOf("(") + 1, string.indexOf(")"))
      .split(",");

    let pos = element.node().getBoundingClientRect();

    position["x"] = parseFloat(translate[0]);
    position["y"] = parseFloat(translate[1]);
    position["left"] = position.x - pos.width / 2;
    position["top"] = position.y - pos.height / 2;
    position["right"] = position.x + pos.width / 2;
    position["bottom"] = position.y + pos.height / 2;
    return position;
  }

  collide(self, words) {
    var a = this.get_position(self);
    if (
      a.left < -this.width / 2 ||
      a.right > this.width / 2 ||
      a.top < -this.height / 2 ||
      a.bottom > this.height / 2
    ) {
      return true;
    }
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var that = d3.select("#wordcloud_" + word.text);
      var b = this.get_position(that);
      if (
        !(
          b.left > a.right ||
          b.right < a.left ||
          b.top > a.bottom ||
          b.bottom < a.top
        )
      ) {
        return true;
      }
    }
    return false;
  }

  /* ref https://github.com/Syzygy2048/RadCloud/blob/master/app/src/main/java/io/github/syzygy2048/radcloud/SpiralGenerator.java */

  move_text(element, iteration) {
    var pos = this.get_position(element);

    const number_of_spiral = 500;
    const thetaMax = number_of_spiral * 2 * Math.PI;
    const radius = this.width / 2;
    const awayStep = radius / thetaMax;
    const chord = 3;
    const theta = chord / awayStep;
    var deltaTheta = theta;
    var away = awayStep * theta;

    for (var i = iteration; i > 0; i--) {
      away = awayStep * deltaTheta;
      deltaTheta += chord / away;
    }
    var around = deltaTheta + 1;
    var x = pos.x + Math.cos(around) * away;
    var y = pos.y + Math.cos(around) * away;
    element.attr("transform", `translate(${x},${y})`);
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
