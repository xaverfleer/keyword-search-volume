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
      elems.startAnalysis.addEventListener("click", handleStartAnalisisClick);
      elems.input.addEventListener("input", handleInputChange);
      updateDownload();

      chrome.storage.sync.get(["keywords-arr", "keywords-obj"], (items) => {
        keywordsArr = items["keywords-arr"] || [];
        keywordsObj = items["keywords-obj"] || {};
        updateDownload();
      });

      initGui();
    } else {
      setTimeout(init);
    }
  }

  function initElems() {
    elems.input = document.querySelector("#keywords");
    elems.resultsTableBody = document.querySelector(".results-table__tbody");
    elems.startAnalysis = document.querySelector("#start-analysis");
    elems.downloadButton = document.querySelector(
      ".step__content-button--download"
    );
    elems.downloadLink = document.querySelector("a");
    elems.downloadHint = document.querySelector("#download-hint");
  }
}

function handleInputChange() {
  updateAnalysisButton();
}

function updateAnalysisButton() {
  if (elems.input.value?.length) {
    elems.startAnalysis.removeAttribute("disabled");
    elems.startAnalysis.removeAttribute("title");
  } else {
    elems.startAnalysis.setAttribute("disabled", "");
    elems.startAnalysis.setAttribute(
      "title",
      "Go to step 1: Enter keywords for analysis."
    );
  }
}

function handleStartAnalisisClick() {
  const keywords = elems.input.value;
  chrome.storage.sync.set({ "keywords-input": keywords });

  {
    const arrRaw = keywords.split(",");
    const arrSanitized = arrRaw.map((k) => k.trim()).filter((k) => k);

    chrome.storage.sync.set({ ["keywords-arr"]: arrSanitized });
    chrome.storage.sync.set({ ["keywords-obj"]: keywordsObj });
  }

  chrome.storage.sync.set({ analyze: false });
  chrome.storage.sync.set({ analyze: true });
}

function handleStorageUpdates(changes) {
  if (changes["keywords-arr"]) {
    keywordsArr = changes["keywords-arr"].newValue;
    updateDownload();
  }

  if (changes["keywords-obj"]) {
    keywordsObj = changes["keywords-obj"].newValue;
    updateDownload();
  }

  updateTable();
}

function initGui() {
  updateTable();
  chrome.storage.sync.get("keywords-input", (items) => {
    elems.input.value = items["keywords-input"] || "";
    updateAnalysisButton();
  });
  updateDownload();
}

function updateTable() {
  chrome.storage.sync.get(["keywords-arr", "keywords-obj"], function (items) {
    let keywordsArr = items["keywords-arr"] || [];
    let keywordsObj = items["keywords-obj"] || {};

    elems.resultsTableBody.innerHTML = "";
    for (let kw of keywordsArr) {
      let tr = document.createElement("tr");

      let tdKey = document.createElement("td");
      tdKey.innerText = kw;
      tr.appendChild(tdKey);

      let searchResults =
        keywordsObj[kw] ||
        (keywordsObj[kw] === 0 ? 0 : "Go to step 2: Start the analysis.");
      let tdRsult = document.createElement("td");
      tdRsult.innerText = searchResults;
      tr.appendChild(tdRsult);

      elems.resultsTableBody.appendChild(tr);
    }
  });
}

function updateDownload() {
  const arr = [["keyword", "keyword-search-volume"]];

  let complete = true;

  for (let kw of keywordsArr) {
    const kwResults = keywordsObj[kw];
    if (typeof kwResults === "number") {
      arr.push([kw, keywordsObj[kw]]);
    } else {
      arr.push([kw, "Not searched yet, go to step 2."]);
      complete = false;
    }
  }

  const linkElem = elems.downloadLink;
  const hintElem = elems.downloadHint;

  hintElem.innerText = complete
    ? ""
    : "Analysis is incomplete, go to step 2 for complete results. Also: check background tabs for a recapcha.";

  if (complete) {
    elems.downloadButton.removeAttribute("disabled");
    linkElem.download = "keyword-search-volume.csv";
    const csv = arr
      .map(function (v) {
        return v.join(",");
      })
      .join("\n");
    linkElem.href = encodeURI("data:text/csv," + csv);
  } else {
    elems.downloadButton.setAttribute("disabled", "");
  }
}
