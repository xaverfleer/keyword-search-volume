console.log("Hello background");

chrome.storage.sync.set({ analyze: false });
let analyzing, keywordsAr, keywordsObj, currentKw;

init();

function handleStorageUpdates(changes) {
  if (changes.analyze) {
    analyzing = changes.analyze.newValue;
    if (analyzing) analyze();
  }

  if (changes["keywords-arr"]) keywordsArr = changes["keywords-arr"].newValue;

  if (changes["keywords-obj"]) keywordsObj = changes["keywords-obj"].newValue;

  if (keywordsObj[currentKw]) {
    currentKw = "";
    analyze();
  }
}

function init() {
  chrome.storage.sync.get(["keywords-arr", "keywords-obj"], (items) => {
    keywordsObj = items["keywords-obj"] || {};
    keywordsArr = items["keywords-arr"] || [];
  });
  chrome.storage.onChanged.addListener(handleStorageUpdates);
}

function analyze() {
  let found = false;
  for (let kw of keywordsArr) {
    if (!keywordsObj[kw]) {
      analyzeKw(kw);
      found = true;
      break;
    }
  }
  chrome.storage.sync.set({ analyze: false });
}

function analyzeKw(kw) {
  currentKw = kw;
  chrome.tabs.create({
    url: `https://www.google.com/search?q=allintitle:${kw}`,
  });
}
