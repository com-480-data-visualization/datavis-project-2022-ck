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

      // Coin Comparison
      deleteTBody();
      updateTable(coins);

      // Text Visualization
      var tv = new TextVisualization("news", coins, start_date, end_date);

      function news_info(id) {
        return (data) => {
          tv.drawText(freqDict(data));
          wordCloud(id, freqDict(data));
        };
      }

      refresh_news_information(
        start_date,
        end_date,
        url_contain,
        parse_news_data,
        range_filter,
        news_info("flex")
      );
    }
  }

  selectBtn.addEventListener("click", refreshPage);
});
