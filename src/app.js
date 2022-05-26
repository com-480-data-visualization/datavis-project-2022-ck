function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

function getDateRange(year, month) {
  month -= 1;
  let start_date = new Date();
  start_date.setFullYear(year);
  start_date.setMonth(month);
  start_date.setDate(1);

  let end_date = new Date();
  if (month < 12) {
    end_date.setFullYear(year);
    end_date.setMonth(month + 1);
  } else {
    end_date.setFullYear(year + 1);
    end_date.setMonth(1);
  }
  end_date.setDate(1);
  end_date.setHours(0, 0, 0);
  return [start_date, end_date];
}

whenDocumentLoaded(() => {
  var st = new SelectionTab();

  let selectBtn = document.getElementById("selectionButton");
  refreshPage();

  function refreshPage() {
    if (st.selectedCoins.length == 0) {
      alert("Select at least one coin");
    } else {
      st.selectBtn();

      let coins = st.selectedCoins;
      let month = st.selectedMonth;
      let year = st.selectedYear;

      let dates = getDateRange(year, month);
      let start_date = dates[0];
      let end_date = dates[1];

      // ------------- Implement the function ------------------------
      // News Headline
      var hl = new NewsHeadLine("news-head", coins, start_date, end_date);
      hl.show_news_headline();
      // Text Visualization
      var tv = new TextVisualization("text-viz", coins, start_date, end_date);
      tv.showTextVisualization();

      // Coin Comparison
      deleteTBody();
      updateTable(coins);

      // Price and News
      price_news_plot(coins, "USD");
    }
  }

  selectBtn.addEventListener("click", refreshPage);
});
