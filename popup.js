"use strict";
console.log("hello popup");

const elems = {};

chrome.storage.onChanged.addListener(handleStorageUpdates);

{
  setTimeout(init);

  function init() {
    const isLoaded = document.querySelector(".results-table__tbody");

    if (isLoaded) {
      initElems();
      elems.updateKwdsButton.addEventListener("click", handleUploadClick);
      elems.startAnalysis.addEventListener("click", handleStartAnalisisClick);

      initGui();
    } else {
      setTimeout(init);
    }
  }

  function initElems() {
    elems.input = document.querySelector("#keywords");
    elems.updateKwdsButton = document.querySelector("#update-keywords");
    elems.resultsTableBody = document.querySelector(".results-table__tbody");
    elems.startAnalysis = document.querySelector("#start-analysis");
  }
}

function handleUploadClick(event) {
  const keywords = elems.input.value;
  chrome.storage.sync.set({ "keywords-input": keywords });

  {
    const keywordArrRaw = keywords.split(",");
    const keywordArr = keywordArrRaw.map((k) => k.trim());
    const keywordObj = {};

    chrome.storage.sync.set({ ["keywords-arr"]: keywordArr });
    chrome.storage.sync.set({ ["keywords-obj"]: keywordObj });
  }
}

function handleStartAnalisisClick() {
  chrome.storage.sync.set({ analyze: true });
}

function handleStorageUpdates(changes) {
  if (changes["keywords-input"]) {
    updateTable();
  }

  if (changes["keywords-arr"]) chrome.storage.sync.set({ analyze: false });
}

function initGui() {
  updateTable();
  chrome.storage.sync.get("keywords-input", (items) => {
    elems.input.value = items["keywords-input"];
  });
}

function updateTable() {
  chrome.storage.sync.get(["keywords-arr", "keywords-obj"], function (items) {
    let keywordsArr = items["keywords-arr"] || [];
    let keywordsObj = items["keywords-obj"] || {};

    for (let kw of keywordsArr) {
      let tr = document.createElement("tr");

      let tdKey = document.createElement("td");
      tdKey.innerText = kw;
      tr.appendChild(tdKey);

      let searchResults = keywordsObj[kw] || "?";
      let tdRsult = document.createElement("td");
      tdRsult.innerText = searchResults;
      tr.appendChild(tdRsult);

      elems.resultsTableBody.appendChild(tr);
    }
  });

  elems.resultsTableBody.innerHTML = "";
}
