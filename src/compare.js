// time line
const img = new Image(20, 20);
const img2 = new Image(20, 20);
const img3 = new Image(20, 20);
const img4 = new Image(20, 20);
const img5 = new Image(20, 20);
const img6 = new Image(20, 20);
const img7 = new Image(20, 20);
const img8 = new Image(20, 20);
const img9 = new Image(20, 20);
const img10 = new Image(20, 20);
const img11 = new Image(20, 20);
const img12 = new Image(20, 20);
const img13 = new Image(20, 20);

img.src = "./coinIcons/ada.svg";
img2.src = "./coinIcons/bch.svg";
img3.src = "./coinIcons/btc.svg";
img4.src = "./coinIcons/dash.svg";
img5.src = "./coinIcons/etc.svg";
img6.src = "./coinIcons/eth.svg";
img7.src = "./coinIcons/ltc.svg";
img8.src = "./coinIcons/trx.svg";
img9.src = "./coinIcons/usdt.svg";
img10.src = "./coinIcons/xmr.svg";
img11.src = "./coinIcons/xrp.svg";
img12.src = "./coinIcons/xtz.svg";
img13.src = "./coinIcons/zec.svg";

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
      pointStyle: [img, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13],
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
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'MMM'
        },
        gridLines: {
          display:false
        }
      }]
    }
  }
});

// table
// var coins = document.getElementById('checkboxes');
checked = document.querySelectorAll('input[type="checkbox"]:checked');
// console.log(document.getElementById('BTC').value)
console.log(checked)
// document.getElementById('selectionButton').onclick = function() {
//     var checkboxes = document.getElementsByName('crypto');
//     for (var checkbox of checkboxes)
//     {
//         if (checkbox.checked) {
//             // document.body.append(checkbox.value + ' ');
//             console.log(checkbox.value)
            
//         }
//     }
// }

document.getElementById('selectionButton').onclick = function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for (var checkbox of checkboxes) {
        document.body.append(checkbox.value + ' ');
    }
}