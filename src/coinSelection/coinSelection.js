class SelectionTab {
  constructor() {
    this.coins = ["BTC", "ETH", "XRP", "LTC", "ADA", "BCH", "USDT", "TRX"];
    this.coinsDescription = [
      "Bitcoin",
      "Ethereum",
      "Ripple",
      "Litecoin",
      "Cardano",
      "Bitcoin Cash",
      "Tether",
      "Tron",
    ];

    this.months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    this.selectedMonth = 3;
    this.selectedYear = 2022;
    this.selectedCoins = ["BTC", "ETH", "XRP"];

    this.showSelectedCoins = this.showSelectedCoins.bind(this);
    this.selectCoins = this.selectCoins.bind(this);
    this.showSelectedDate = this.showSelectedDate.bind(this);
    this.selectBtn = this.selectBtn.bind(this);

    let checkboxes = document.getElementById("checkboxes");
    this.showMultiSelection(checkboxes);
    checkboxes.addEventListener("click", this.selectCoins);

    let showBtn = document.getElementById("tabShowBtn");
    showBtn.addEventListener("click", this.tabVisible);

    let selectedCoins = document.getElementById("selectedCoins");
    selectedCoins.addEventListener("click", this.tabVisible);

    let selectedDate = document.getElementById("selectedDate");
    selectedDate.addEventListener("click", this.tabVisible);

    let monthDiv = document.getElementById("months");
    let yearDiv = document.getElementById("years");
    this.showYears(yearDiv);
    this.showMonths(monthDiv);

    this.showSelectedCoins();
    this.showSelectedDate();
  }

  selectBtn() {
    this.tabVisible();
    this.showSelectedCoins();
    this.showSelectedDate();
  }
  getSelectedOption(sel) {
    var opts = [];
    for (var i = 0, len = sel.children.length; i < len; i++) {
      var opt = sel.children[i];
      if (opt.getElementsByTagName("input")[0].checked === true) {
        opt.classList.add("select");
        let val = opt.className;
        val = val.replace(" select", "");
        opts.push(val);
      } else {
        opt.classList.remove("select");
      }
    }
    return opts;
  }

  disableCheck(disable, sel) {
    for (var i = 0, len = sel.children.length; i < len; i++) {
      var opt = sel.children[i];
      if (!opt.classList.contains("select")) {
        opt.getElementsByTagName("input")[0].disabled = disable;
        if (disable) opt.classList.add("disabled");
        else opt.classList.remove("disabled");
      }
    }
  }
  selectCoins() {
    let checkboxes = document.getElementById("checkboxes");
    this.selectedCoins = this.getSelectedOption(checkboxes);
    if (this.selectedCoins.length == 4) {
      this.disableCheck(true, checkboxes);
    } else {
      this.disableCheck(false, checkboxes);
    }
  }
  showSelectedCoins() {
    let div = document.getElementById("selectedCoins");
    div.innerHTML = "";

    this.selectedCoins.forEach((value) => {
      var img = document.createElement("img");
      img.src = "./coinIcons/" + value.toLowerCase() + ".svg";
      div.appendChild(img);
    });
  }
  showMultiSelection(checkboxes) {
    this.coins.forEach((value, index) => {
      const label = document.createElement("label");
      label.className = value;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = value;
      if (this.selectedCoins.includes(value)) {
        input.checked = true;
      }
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
    if (tab.className == "m-fadeIn") {
      tab.classList.remove("m-fadeIn");
      tab.classList.toggle("m-fadeOut");
    } else {
      tab.classList.remove("m-fadeOut");
      tab.classList.toggle("m-fadeIn");
    }
  }
  showMonths(div) {
    Array(12)
      .fill(0)
      .forEach((_, index) => {
        let month = document.createElement("div");
        month.className = "date";
        if (this.selectedMonth - 1 == index) {
          month.classList.add("select");
        }
        let span = document.createElement("span");
        span.textContent = this.months[index];
        month.appendChild(span);
        month.addEventListener("click", () => this.selectDate("month", index));

        div.appendChild(month);
      });

    if (this.selectedYear == 2022) {
      this.disableMonth(true);
    }
  }
  showYears(div) {
    Array(10)
      .fill(0)
      .forEach((_, index) => {
        let year = document.createElement("div");
        year.className = "date";
        if (this.selectedYear == index + 2013) {
          year.classList.add("select");
        }
        let span = document.createElement("span");
        span.textContent = index + 2013;
        year.appendChild(span);
        year.addEventListener("click", () => this.selectDate("year", index));

        div.appendChild(year);
      });
  }
  disableMonth(disable) {
    let sel = document.getElementById("months");
    for (var i = 0; i < sel.children.length; i++) {
      var opt = sel.children[i];
      if (disable && i > 3) {
        opt.classList.add("disabled");
      } else {
        opt.classList.remove("disabled");
      }
    }
  }
  selectDate(type, val) {
    var sel;
    if (type == "month") {
      sel = document.getElementById("months");
      this.selectedMonth = val + 1;
    } else {
      sel = document.getElementById("years");
      this.selectedYear = val + 2013;
      if (this.selectedYear == 2022) {
        this.disableMonth(true);
      } else {
        this.disableMonth(false);
      }
    }
    var opts = [];
    for (var i = 0; i < sel.children.length; i++) {
      var opt = sel.children[i];
      if (i == val) {
        opt.classList.add("select");
        let val = opt.className;
        val = val.replace(" select", "");
      } else {
        opt.classList.remove("select");
      }
    }
    return opts;
  }
  showSelectedDate() {
    let div = document.getElementById("selectedDate");
    div.innerHTML =
      this.selectedYear + " " + this.months[this.selectedMonth - 1];
  }
}
