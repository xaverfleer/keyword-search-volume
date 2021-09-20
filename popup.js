"use strict";
console.log("hello popup");

const elems = {};

const storageKeys = {
  kwdsInput: "keywords-input",
  kwdsArr: "keywords-arr",
  kwdsObj: "keywords-obj",
};

chrome.storage.onChanged.addListener(handleStorageUpdates);

{
  function init() {
    elems.resultsTableBody =
      elems.resultsTableBody || document.querySelector(".results-table__tbody");

    if (elems.resultsTableBody) {
      initElems();
      elems.button.addEventListener("click", handleUploadClick);

      updateTable();
    } else {
      setTimeout(init);
    }
  }
  setTimeout(init);

  function initElems() {
    elems.input = document.querySelector("#keywords");
    elems.button = document.querySelector("#save-keywords");
    elems.resultsTableBody = document.querySelector(".results-table__tbody");
  }
}

function handleUploadClick(event) {
  const keywords = elems.input.value;
  chrome.storage.sync.set({ [storageKeys.kwdsInput]: keywords });

  {
    const keywordArrRaw = keywords.split(",");
    const keywordArr = keywordArrRaw.map((k) => k.trim());
    const keywordObj = {};

    chrome.storage.sync.set({ [storageKeys.kwdsArr]: keywordArr });
    chrome.storage.sync.set({ [storageKeys.kwdsObj]: keywordObj });
  }
}

function handleStorageUpdates(changes) {
  const didKeywordsChange = changes[storageKeys.kwdsInput]?.newValue;
  if (didKeywordsChange) {
    updateTable();
  }
}

function updateTable() {
  chrome.storage.sync.get(
    [storageKeys.kwdsArr, storageKeys.kwdsObj],
    function (items) {
      let keywordsArr = items[storageKeys.kwdsArr];
      let keywordsObj = items[storageKeys.kwdsObj];

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
    }
  );

  elems.resultsTableBody.innerHTML = "";
}
