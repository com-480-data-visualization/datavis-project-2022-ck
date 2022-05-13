function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

class CoinSelection {
  constructor(container) {
    this.container = container;
    this.coins = [
      "BTC",
      "ETH",
      "XRP",
      "LTC",
      "ADA",
      "BCH",
      "USDT",
      "XMR",
      "TRX",
      "ETC",
      "DASH",
      "ZEC",
      "XTZ",
    ];
    this.coinsDescription = [
      "Bitcoin",
      "ETH",
      "XRP",
      "Litecoin",
      "ADA",
      "BCH",
      "USDT",
      "XMR",
      "TRX",
      "ETC",
      "DASH",
      "ZEC",
      "XTZ",
    ];
    this.selectedCoins = [];
    this.expanded = false;
    this.showSelectedCoins = this.showSelectedCoins.bind(this);
  }

  getSelectedOption(sel) {
    var opts = [];
    for (var i = 0, len = sel.children.length; i < len; i++) {
      var opt = sel.children[i];
      if (opt.getElementsByTagName("input")[0].checked === true) {
        opts.push(opt.className);
      }
    }
    return opts;
  }

  disableCheck(disable, sel) {
    for (var i = 0, len = sel.children.length; i < len; i++) {
      var opt = sel.children[i];
      if (!this.selectedCoins.includes(opt.className))
        opt.getElementsByTagName("input")[0].disabled = disable;
    }
  }
  showSelectedCoins() {
    let div = document.getElementById("selectedCoins");
    div.innerHTML = "";

    let checkboxes = document.getElementById("checkboxes");
    this.selectedCoins = this.getSelectedOption(checkboxes);

    this.selectedCoins.forEach((value) => {
      var img = document.createElement("img");
      img.src = "./coinIcons/" + value.toLowerCase() + ".svg";
      div.appendChild(img);
    });

    if (this.selectedCoins.length == 4) {
      this.disableCheck(true, checkboxes);
    } else {
      this.disableCheck(false, checkboxes);
    }
  }
  showMultiSelection(checkboxes) {
    this.coins.forEach((value, index) => {
      const label = document.createElement("label");
      label.className = value;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = value;
      label.appendChild(input);

      const img = document.createElement("img");
      img.src = "./coinIcons/" + value.toLowerCase() + ".svg";
      label.appendChild(img);

      const div = document.createElement("div");
      div.id = "labelText";

      const h4 = document.createElement("h4");
      h4.textContent = value;
      div.appendChild(h4);

      const p = document.createElement("p");
      p.textContent = this.coinsDescription[index];
      div.appendChild(p);

      label.appendChild(div);

      checkboxes.appendChild(label);
    });
  }
  tabVisible() {
    let tab = document.getElementById("tab");
    if (tab.className == "m-fadeIn" || tab.className == "") {
      tab.classList.toggle("m-fadeOut");
    } else {
      tab.classList.toggle("m-fadeIn");
    }
  }
}

whenDocumentLoaded(() => {
  const selectionBox = document.getElementsByClassName("selectionBox");
  var cs = new CoinSelection(selectionBox);

  let checkboxes = document.getElementById("checkboxes");
  cs.showMultiSelection(checkboxes);
  checkboxes.addEventListener("click", cs.showSelectedCoins);

  let submitBtn = document.getElementById("selectionButton");
  submitBtn.addEventListener("click", cs.tabVisible);

  let showBtn = document.getElementById("tabShowBtn");
  showBtn.addEventListener("click", cs.tabVisible);
});
