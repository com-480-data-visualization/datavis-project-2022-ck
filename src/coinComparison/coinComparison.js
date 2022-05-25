// ------------------------------time line------------------------------
let images = []
const coin_color = {'ada': "#FFFFFF", 
                  'bch': "#98C261",
                  'btc': "#E9983D",
                  'eth': "#687DE3",
                  'ltc': "#BEBBBB",
                  'trx': "#DB2F33",
                  'usdt': "#509F7D",
                  'xrp': "#24292E"}
const months = {
  "Jan": 0,
  "Feb": 1,
  "Mar": 2,
  "Apr": 3,
  "May": 4,
  "Jun": 5,
  "Jul": 6,
  "Aug": 7,
  "Sep": 8,
  "Oct": 9,
  "Nov": 10,
  "Dec": 11,
};

const coins = Object.keys(coin_color);
for (let i = 0; i < coins.length; i++) {
  let img = new Image(50, 50);
  img.src = './coinIcons/' + coins[i] + '.svg';
  images.push(img)
}

var ctx = document.getElementById('timelinecanvas').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      data: [
        { x: "2017-09-27", y: 0 },
        { x: "2017-08-01", y: 0 },
        { x: "2009-01-03", y: 0 },
        { x: "2016-07-20", y: 0 }, // eth
        { x: "2020-04-12", y: 0 }, // itc-not found
        { x: "2018-07-25", y: 0 }, // trx
        { x: "2014-10-06", y: 0 }, // usdt
        { x: "2020-09-24", y: 0 }, // xrp
      ],
      pointStyle: images,
      borderWidth: 1
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false,
        },        
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip:true,
          maxTicksLimit: 20,
          maxRotation: 60
        },
        type: 'time',
        time: {
          // unit: 'month',
          // tooltipFormat: 'MMM'
        },
        gridLines: {
          display: false
        }
      }]
    }
  }
});

// ------------------------------table------------------------------
var coinTable = document.getElementById('coinTable');
const sum = arr => arr.reduce((a,b) => a + b, 0);
const average = arr =>(sum(arr) / arr.length).toFixed(2);

function deleteTBody() {
  const rowCount = coinTable.rows.length - 1;
  for (var i = rowCount; i > 0; i--) {
    coinTable.deleteRow(i);
  }
}

function updateTable(coins) { 
  const selected_date = document.getElementsByClassName('date select');
  const year = selected_date[0].lastChild.innerHTML;
  const month = selected_date[1].lastChild.innerHTML;
  let counter = collect(coins.length, (v) => updateCircles(v))
  d3.select("#circleSvg").remove();
  coins.forEach(async e => {
    let newRow = coinTable.insertRow(-1);
    let newType = newRow.insertCell(0);
    let newPrice = newRow.insertCell(1);
    let newVolume = newRow.insertCell(2);
    let newPosition = newRow.insertCell(3);
    let newKeyWords = newRow.insertCell(4);
    let img = new Image();
    img.src = 'coinIcons/' + e.toLowerCase() +'.svg';
    
    let newT = document.createTextNode(e);
    newType.append(img, newT);

    let url = '../cleaned_data/coin/' + e + '_USD.csv';
    var coin_data = function(data) {
      var closeP = [];
      var volumeT = [];
      var volumeF = [];
      for (i = 0; i < data.length; i++) {
        let date = new Date(data[i].date);
        if (date.getMonth() == months[month] && date.getFullYear() == parseInt(year)) {
          
          closeP.push(parseFloat(data[i].close));
          volumeF.push(parseInt(data[i].volumefrom));
          volumeT.push(parseInt(data[i].volumeto));
        }
      }
      let newP = document.createTextNode(average(closeP));
      let volumeS = sum(volumeT) + sum(volumeF);
      let newV = document.createTextNode(volumeS);
      let pos = 'N/A';
      if (volumeS !== 0) {
        pos = (volumeF > volumeT) ? 'Sell' : 'Buy';
      }
      let newPos = document.createTextNode(pos);
      newPrice.append('$', newP);
      newVolume.append('$', newV);
      newPosition.appendChild(newPos);
      counter([e, volumeS]);
    }
    await d3.csv(url).then(coin_data);
  })
}

// ------------------------------circles------------------------------
function updateCircles(v) {
  // let counter = collect(coins.length, (v) => {
  var h = 5
  var w = 5

  var circleSvg = d3.select('#volumeCircle');
  circleSvg.append('svg')
    .attr("id", "circleSvg")
    .attr('width', w)
    .attr('height', h)
    .attr('class','radSol');

  const data = [ { "x": 50, "y": 100}, { "x": 1000, "y": 100}];
  const lineGenerator = d3.line()
  .x(d => d.x)
  .y(d => d.y);

  circleSvg.append("path")
  .attr("d", lineGenerator(data))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");

  circleSvg.selectAll('.circles')
  .data(v)
  .enter()
  .append('circle')
  .attr('r', function(d, i){ return d[1]*1e-8 })
  .attr('class','circles')
  .attr('cx', function(d, i) { return 80+200*i; })
  .attr('cy', 100)
  .attr('fill', function(d, i) { return coin_color[d[0].toLowerCase()]; })
  
  circleSvg.selectAll('text')
  .data(v).enter().append('text')
  .text(function(d, i) {
    return '$'+parseFloat(d[1]*1e-8).toFixed(2)+'B';
  })
  .attr('font-size', 10)
  .attr('fill', 'black')
  .attr('y', 100)
  .attr('x', function(d, i){ return 80+200*i; })
  .attr('text-anchor', 'middle')
}