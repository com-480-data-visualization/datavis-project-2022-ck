const coin_color = {
  ADA: "#111E2F",
  BCH: "#98C261",
  BTC: "#E9983D",
  ETH: "#687DE3",
  LTC: "#BEBBBB",
  TRX: "#DB2F33",
  USDT: "#509F7D",
  XRP: "#24292E",
};

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const average = (arr) => (sum(arr) / arr.length).toFixed(2);

// ---------------------------initial release timeline---------------------------
let images = [];
const months = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};
const coins = Object.keys(coin_color);
for (let i = 0; i < coins.length; i++) {
  let img = new Image(50, 50);
  img.src = "./coinIcons/" + coins[i].toLowerCase() + ".svg";
  images.push(img);
}

var ctx = document.getElementById("timelinecanvas").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [
      {
        data: [
          { x: "2017-09-27", y: 0 }, // ada
          { x: "2017-08-01", y: 0 }, // bch
          { x: "2009-01-03", y: 0 }, // btc
          { x: "2016-07-20", y: 0 }, // eth
          { x: "2011-10-07", y: 0 }, // ltc
          { x: "2018-07-25", y: 0 }, // trx
          { x: "2014-10-06", y: 0 }, // usdt
          { x: "2012-06-01", y: 0 }, // xrp
          { x: "2019-01-01", y: 0 }, // end
          { x: "2009-01-01", y: 0 }, // begin
        ],
        pointStyle: images,
        borderWidth: 1,
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            maxTicksLimit: 30,
            maxRotation: 35,
          },
          type: "time",
          // time: {
          //   unit: 'month',
          //   tooltipFormat: 'MMM'
          // },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  },
});

// ------------------------------table------------------------------
var coinTable = document.getElementById("coinTable");
function deleteTBody() {
  const rowCount = coinTable.rows.length - 1;
  for (var i = rowCount; i > 0; i--) {
    coinTable.deleteRow(i);
  }
}

function updateTable(coins) {
  const selected_date = document.getElementsByClassName("date select");
  const year = selected_date[0].lastChild.innerHTML;
  const month = selected_date[1].lastChild.innerHTML;

  let counter = collect(coins.length, (v) => updateCircles(v, year, month));
  coins.forEach(async (e) => {
    let newRow = coinTable.insertRow(-1);
    let newType = newRow.insertCell(0);
    let newPrice = newRow.insertCell(1);
    let newVolume = newRow.insertCell(2);
    let newPosition = newRow.insertCell(3);
    // let newKeyWords = newRow.insertCell(4);

    let img = new Image();
    img.src = "coinIcons/" + e.toLowerCase() + ".svg";

    let newT = document.createTextNode(e);
    newType.append(img, newT);

    let url = "../cleaned_data/coin/" + e + "_USD.csv";
    var coin_data = function (data) {
      var closeP = [];
      var volumeT = [];
      var volumeF = [];
      var volumeY = [];
      for (i = 0; i < data.length; i++) {
        let date = new Date(data[i].date);
        if (date.getFullYear() == parseInt(year)) {
          volumeY.push(
            parseInt(data[i].volumefrom) + parseInt(data[i].volumeto)
          );
          if (date.getMonth() == months[month]) {
            closeP.push(parseFloat(data[i].close));
            volumeF.push(parseInt(data[i].volumefrom));
            volumeT.push(parseInt(data[i].volumeto));
          }
        }
      }
      let newP = document.createTextNode(average(closeP));
      let volumeM = sum(volumeT) + sum(volumeF);
      let newV = document.createTextNode(volumeM);
      let pos = "N/A";
      if (volumeM !== 0) {
        pos = volumeF > volumeT ? "Sell" : "Buy";
      }
      let newPos = document.createTextNode(pos);
      newPrice.append("$", newP);
      newVolume.append("$", newV);
      newPosition.appendChild(newPos);
      counter([e, volumeM, sum(volumeY)]);
    };
    await d3.csv(url).then(coin_data);
  });
}
// TO DO - clear circleSvg, add coin name to arcSvg
// coin keywords
// ------------------------------circles------------------------------
function updateCircles(v, year, month) {
  const width = 500;
  const start = 210;
  const interval = 300;
  var circleSvg = d3.select("#volumeCircle");

  circleSvg
    .append("text")
    .text("Monthly Volume")
    .attr("x", 0)
    .attr("y", 80)
    .attr("stroke", "#51c5cf")
    .attr("stroke-width", 1);

  circleSvg.selectAll("svg").remove();
  circleSvg
    .append("svg")
    .attr("id", "circleSvg")
    .attr("width", width)
    .attr("height", 5)
    .attr("class", "radSol");

  const data = [
    { x: start, y: 75 },
    { x: start + interval * (v.length - 1), y: 75 },
  ];
  const lineGenerator = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);

  circleSvg
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    .attr("fill", "none");

  circleSvg
    .selectAll(".circles")
    .data(v)
    .enter()
    .append("circle")
    .attr("r", function (d, _) {
      console.log(d[1] * 1e-9)
      return d[1] * 1e-9;
    })
    .attr("class", "circles")
    .attr("cx", function (_, i) {
      return start + interval * i;
    })
    .attr("cy", 75)
    .attr("fill", function (d, _) {
      return coin_color[d[0]];
    });

  circleSvg
    .selectAll("#volume_texts")
    .data(v)
    .enter()
    .append("text")
    .text(function (d, _) {
      return "$" + parseFloat(d[1] * 1e-9).toFixed(2) + "B";
    })
    .attr("font-size", 10)
    .attr("fill", "black")
    .attr("y", 75)
    .attr("x", function (d, i) {
      return start + interval * i;
    })
    .attr("text-anchor", "middle");

  updateArc(v, year, month);
}

// ------------------------------arcs------------------------------
function updateArc(v, year, month) {
  var pie = d3.pie();
  const width = 500;

  let volumeM_arr = [];
  let volumeY_arr = [];
  for (const [_, volumeM, volumeY] of v) {
    volumeM_arr.push(volumeM);
    volumeY_arr.push(volumeY);
  }
  const vms = sum(volumeM_arr);
  const volumeM_percent = volumeM_arr.map((x) => ((x / vms) * 100).toFixed(2));

  const vys = sum(volumeY_arr);
  const volumeY_percent = volumeY_arr.map((x) => ((x / vys) * 100).toFixed(2));

  // ------monthly arc------
  var arc = d3
    .arc()
    .innerRadius(width / 4)
    .outerRadius(width / 2.5);
  var arcSvg = d3
    .select("#volumePercent")
    .attr("width", width)
    .attr("height", width)
    .append("g");
  arcSvg
    .append("text")
    .text("$" + (vms * 1e-9).toFixed(2) + "B")
    .attr("x", width / 2.3)
    .attr("y", width / 2)
    .attr("fill", "#51c5cf");
  arcSvg
    .append("text")
    .text("in " + month + " " + year)
    .attr("x", width / 2.43)
    .attr("y", width / 1.8)
    .attr("fill", "#51c5cf");

  var arcs = arcSvg
    .selectAll("g.arc")
    .data(pie(volumeM_percent))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + width / 2 + ", " + width / 2 + ")");
  arcs
    .append("path")
    .attr("fill", function (_, i) {
      return coin_color[v[i][0]];
    })
    .attr("d", arc);
  arcs
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("fill", "#51c5cf")
    .text(function (d, _) {
      return d.value + "%";
    });

  // ------yearly arc------
  var arcSvg2 = d3
    .select("#volumeYear")
    .attr("width", width)
    .attr("height", width)
    .append("g");
  arcSvg2
    .append("text")
    .text("$" + (vys * 1e-9).toFixed(2) + "B")
    .attr("x", width / 2.3)
    .attr("y", width / 2)
    .attr("fill", "#51c5cf");
  arcSvg2
    .append("text")
    .text("in " + year)
    .attr("x", width / 2.2)
    .attr("y", width / 1.8)
    .attr("fill", "#51c5cf");

  var arcs2 = arcSvg2
    .selectAll("g.arc")
    .data(pie(volumeY_percent))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + width / 2 + ", " + width / 2 + ")");
  arcs2
    .append("path")
    .attr("fill", function (_, i) {
      return coin_color[v[i][0]];
    })
    .attr("d", arc);
  arcs2
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("fill", "#51c5cf")
    .text(function (d, _) {
      return d.value + "%";
    });
}
