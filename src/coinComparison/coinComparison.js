// time line

let images = []
let coins = ['ada', 'bch', 'btc', 'dash', 'etc', 'eth', 'ltc', 'trx', 'usdt', 'xmr', 'xrp', 'xtz', 'zec']

for (let i = 0; i < coins.length; i++) {
  img = new Image(30, 30);
  img.src = './coinIcons/' + coins[i] + '.svg';
  images.push(img)
}

var ctx = document.getElementById('timeline').getContext('2d');
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
        { x: "2014-04-18", y: 0 }, // xmr
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

// table
var coinTable = document.getElementById('coinTable');

document.getElementById('selectionButton').onclick = function() {
  let selectedCoins = [];
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  for (var checkbox of checkboxes) {
      selectedCoins.push(checkbox.id)
  };
  deleteTBody();
  updateTable(selectedCoins);
}

function deleteTBody() {
  const rowCount = coinTable.rows.length - 1;
  for (var i = rowCount; i > 0; i--) {
    coinTable.deleteRow(i);
  }
}

function updateTable(coins) { 
  coins.forEach(e => {
    let newRow = coinTable.insertRow(-1);
    let newType = newRow.insertCell(0);
    let newPrice = newRow.insertCell(1);
    let newVolume = newRow.insertCell(2);
    let newPosition = newRow.insertCell(3);
    let newKeyWords = newRow.insertCell(4);
    let img = new Image();
    img.src = 'coinIcons/' + e.toLowerCase() +'.svg';
    let newT = document.createTextNode(e);
    let newP = document.createTextNode(e);
    newType.appendChild(img, newT);
    readFile("../cleaned_data/" + e + "_USD.csv")
  })
}

function readFile(url) {
  d3.csv(url,
    data => {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].close);
        console.log(data[i].volumeto);
      }
    })
}
