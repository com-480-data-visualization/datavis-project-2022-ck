class TextVisualization {
  constructor(selector, coins, start_date, end_date) {
    this.selector = selector;
    this.coins = coins;
    this.start_date = start_date;
    this.end_date = end_date;

    this.width = 500;
    this.height = 500;
    this.radius = this.width / 2;

    this.colors = {
      BTC: "#E9983D",
      ETH: "#687DE3",
      XRP: "#24292E",
      LTC: "#BEBBBB",
      ADA: "#FFFFFF",
      BCH: "#98C261",
      USDT: "#509F7D",
      TRX: "#DB2F33",
    };

    this.scaleAngle = d3
      .scaleLinear()
      .domain([0, this.coins.length])
      .range([0, 2 * Math.PI]);

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
        .innerRadius(this.radius - 60)
        .outerRadius(this.radius - 30)
        .startAngle(this.scaleAngle(idx))
        .endAngle(this.scaleAngle(idx + 1));

      this.svg
        .append("path")
        .attr("id", "arc_" + val)
        .attr("class", "arc")
        .attr("d", arc)
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

  drawText(data) {
    if(data == null) return null;
    freqDict(data, );
  }

  showTextVisualization(){
    // refresh_news_information(
    //   this.start_date,
    //   this.end_date,
    //   this.coins, 
    //   url_contain,
    //   parse_news_data,
    //   range_news_filter,
    //   this.drawText
    // );
  }
}
