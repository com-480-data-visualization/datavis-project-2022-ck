function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

whenDocumentLoaded(() => {
  // Create instance for classes
  var st = new SelectionTab();

  let selectBtn = document.getElementById("selectionButton");

  function refreshPage() {
    if (st.selectedCoins.length == 0) {
      alert("Select at least one coin");
    } else {
      st.selectBtn();

      let coins = st.selectedCoins;
      let month = st.selectedMonth;
      let year = st.selectedYear;

      //Implement the function
    }
  }

  selectBtn.addEventListener("click", refreshPage);
});
