const elems = {
  input: document.querySelector('input[aria-label="Search"]'),
  results: document.querySelector("#result-stats"),
  submit: document.querySelector('button[aria-label="Google Search"]'),
};

const searchTerm = elems.input.value.split(/^allintitle:/)[1];

if (searchTerm) {
  var resultsNum = elems.results
    ? +elems.results.innerText.match(/[0-9’]+/)[0].replace(/’/g, "")
    : 0;

  chrome.storage.sync.get(["keywords-obj"], (items) => {
    const kwObj = items["keywords-obj"];
    kwObj[searchTerm] = resultsNum;
    chrome.storage.sync.set({ "keywords-obj": kwObj });
    debugger;
  });
}
