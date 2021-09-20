console.log("hello popup");

const elems = {
  input: document.querySelector("#keywords"),
  button: document.querySelector("#save-keywords"),
  resultsTableBody: document.querySelector(".results-table__tbody"),
};

const storageKeys = {
  kwdsInput: "keywords-input",
  kwdsArr: "keywords-arr",
  kwdsObj: "keywords-obj",
};

elems.button.addEventListener("click", function handleUploadClick(event) {
  const keywords = elems.input.value;
  chrome.storage.sync.set({ [storageKeys.kwdsInput]: keywords });

  {
    const keywordArrRaw = keywords.split(",");
    const keywordArr = keywordArrRaw.map((k) => k.trim());
    const keywordObj = {};

    chrome.storage.sync.set({ [storageKeys.kwdsArr]: keywordArr });
    chrome.storage.sync.set({ [storageKeys.kwdsObj]: keywordObj });
  }
});

chrome.storage.onChanged.addListener(function (changes) {
  elems.resultsTableBody =
    elems.resultsTableBody || document.querySelector(".results-table__tbody");

  const didKeywordsChange = changes[storageKeys.kwdsInput]?.newValue;
  if (didKeywordsChange) {
    let keywordsArr;
    chrome.storage.sync.get(
      [storageKeys.kwdsArr, storageKeys.kwdsObj],
      function (items) {
        keywordsArr = items[storageKeys.kwdsArr];
        keywordsObj = items[storageKeys.kwdsObj];

        for (kw of keywordsArr) {
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
});
