// ------------------------------time line------------------------------
let images = []
let coins = ['ada', 'bch', 'btc', 'dash', 'etc', 'eth', 'ltc', 'trx', 'usdt', 'xrp', 'xtz', 'zec']
let months = {
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
for (let i = 0; i < coins.length; i++) {
  img = new Image(50, 50);
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
        { x: "2014-01-18", y: 0 }, // dash
        { x: "2015-07-30", y: 0 }, // etc
        { x: "2016-07-20", y: 0 }, // eth
        { x: "2020-04-12", y: 0 }, // itc-not found
        { x: "2018-07-25", y: 0 }, // trx
        { x: "2014-10-06", y: 0 }, // usdt
        { x: "2020-09-24", y: 0 }, // xrp
        { x: "2018-06-30", y: 0 }, // xtz
        { x: "2016-10", y: 0 }, // zec - Zcash was first mined in late October 2016
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

document.getElementById('selectionButton').onclick = function() {
  let selectedCoins = [];
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  for (var checkbox of checkboxes) {
      selectedCoins.push(checkbox.id)
  };
  deleteTBody();
  updateTable(selectedCoins);
  // updateCircles();
}

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
  let counter = collect(coins.length, (v) => {
    let vol = {}
    // console.log(v.length);
    // texts = v;
    for (let i = 0; i < v.length; i++) {
      values = Object.values(v[i]);
      vol[values[0]] = values[1];
      // coin, volume = v[i].split
      // var vol = v[i][1];
      // texts.push(vol);
    }
    var h = 595
    var w = 595
    var xspa = 30

    var circleSvg = d3.select('#volumeCircle');
    circleSvg.append('svg').attr("id", "circleSvg").attr('width', w).attr('height', h).attr('class','radSol');

    var volumes = Object.values(vol)
    var circs = volumes.map(v => v * 1e-8);
    console.log(circs);

    var rscale = d3.scale.linear()

    const data = [ { "x": 50, "y": 80}, { "x": 1000, "y": 80}];
    const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y);

    circleSvg.append("path")
    .attr("d", lineGenerator(data))
    .attr("stroke", "blue")
    .attr("stroke-width", 12)
    .attr("fill", "none");

    circleSvg.selectAll('.circles').data(circs)
    .enter()
    .append('circle')
    .attr('r', function(d){
      return d
    })
    .attr('class','circles')
    .attr('cx', function(d, i) { return 80+200*i; })
    .attr('cy', 100)
    .attr('fill', 'grey')
    
    
    circleSvg.selectAll('text')
    .data(circs).enter().append('text')
    .text(function(d,i) { return volumes[i]; })
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('y', 100)
    .attr('x', function(d, i){ return 80+200*i; })
    .attr('text-anchor', 'middle')
  });
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
    let url = '../cleaned_data/' + e + '_USD.csv';
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
// function updateCircles() {
  // console.log(Object.values(volumes));
  // console.log(volumes.length);
  // for (let i = 0; i < volumes.length; i++) {
  //   console.log(volumes[i])
  // }
//   const table = document.getElementById('coinTable');
//   for (let i in table.rows) {
//     let row = table.rows[i];
//     console.log(row.cells[2]);
//  }
// }