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
    this.drawText();
  }

  drawCircle() {
    this.coins.forEach((val, idx) => {
      var arc = d3
        .arc()
        .innerRadius(0.75)
        .outerRadius(0.85)
        .startAngle(this.scaleAngle(idx))
        .endAngle(this.scaleAngle(idx + 1));

      this.svg
        .append("path")
        .attr("id", "arc_" + val)
        .attr("class", "arc")
        .attr("d", arc)
        .attr("transform", `scale(${this.width / 2}, ${this.height / 2})`)
        .attr("fill", this.colors[val]);

      this.svg
        .append("text")
        .attr("dy", -10)
        .append("textPath")
        .attr("xlink:href", "#arc_" + val)
        .style("text-anchor", "middle")
        .attr("startOffset", "25%")
        .text(val);
    });
  }

  drawText() {
    var svg = this.svg;
    const width = this.width;
    const height = this.height;
    const max_num = 50;
    const selectedCoins = this.coins;
    const color = this.colors;
    return (data) => {
      var words = freqDict(data);
      words.sort((a, b) => b.count - a.count);
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

      var cloud = svg
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
        .style("opacity", 0.6);

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
        });

      // Add horizontal bar
      words.forEach((word) => {
        const stack_data = d3.stack().keys(selectedCoins)([word.ratio]);
        let word_g = svg.selectAll("#wordcloud_" + word.text);
        let width = word_g.select("text").node().getBoundingClientRect().width;
        word_g
          .append("g")
          .selectAll("g")
          .data(stack_data)
          .enter()
          .append("rect")
          .attr("fill", (d) => color[d.key])
          .attr("x", (d) => d[0][0] * width - width / 2)
          .attr("y", 0)
          .attr("width", (d) => (d[0][1] - d[0][0]) * width)
          .attr("height", 5);
      });

      // Do not Overlap
      words.forEach((word) => {
        let id = "#wordcloud_" + word.text;
        svg
          .selectAll(id)
          .on("mouseover", (d, i) => {
            d3.select(id).transition().duration("50").style("opacity", 1);
            d3.select(id).select("text").style("background-color", "white");
          })
          .on("mouseout", (d, i) => {
            d3.select(id).transition().duration("50").style("opacity", 0.6);
          });
      });
    };
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
