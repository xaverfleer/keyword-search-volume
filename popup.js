"use strict";
console.log("hello popup");

const elems = {};
let keywordsArr = [],
  keywordsObj = {};

chrome.storage.onChanged.addListener(handleStorageUpdates);

{
  setTimeout(init);

  function init() {
    const isLoaded = document.querySelector(".results-table__tbody");

    if (isLoaded) {
      initElems();
      elems.updateKwdsButton.addEventListener("click", handleUploadClick);
      elems.startAnalysis.addEventListener("click", handleStartAnalisisClick);

      chrome.storage.sync.get(["keywords-arr", "keywords-obj"], (items) => {
        keywordsArr = items["keywords-arr"] || [];
        keywordsObj = items["keywords-obj"] || {};
        updateDownloadLink();
      });

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
    elems.downloadLink = document.querySelector("a");
  }
}

function handleUploadClick(event) {
  const keywords = elems.input.value;
  chrome.storage.sync.set({ "keywords-input": keywords });

  {
    const arrRaw = keywords.split(",");
    const arrSanitized = arrRaw.map((k) => k.trim()).filter((k) => k);

    chrome.storage.sync.set({ ["keywords-arr"]: arrSanitized });
    chrome.storage.sync.set({ ["keywords-obj"]: keywordsObj });
  }
}

function handleStartAnalisisClick() {
  chrome.storage.sync.set({ analyze: true });
}

function handleStorageUpdates(changes) {
  if (changes["keywords-input"]) {
    updateTable();
  }

  if (changes["keywords-arr"]) {
    chrome.storage.sync.set({ analyze: false });
    keywordsArr = changes["keywords-arr"].newValue;
  }

  if (changes["keywords-obj"]) {
    chrome.storage.sync.set({ analyze: false });
    keywordsObj = changes["keywords-obj"].newValue;
    updateDownloadLink();
  }
}

function initGui() {
  updateTable();
  chrome.storage.sync.get("keywords-input", (items) => {
    elems.input.value = items["keywords-input"];
  });
  updateDownloadLink();
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

function updateDownloadLink() {
  const arr = [["keyword", "keyword-search-volume"]];
  for (let kw of keywordsArr) {
    arr.push([kw, keywordsObj[kw]]);
  }

  var elem = elems.downloadLink;

  elem.download = "keyword-search-volume.csv";
  var csv = arr
    .map(function (v) {
      return v.join(",");
    })
    .join("\n");
  elem.href = encodeURI("data:text/csv," + csv);
}
