const elems = {
  input: document.querySelector('input[aria-label="Search"]'),
  results: document.querySelector("#result-stats"),
  heading: document.querySelector('p[role="heading"]'),
  submit: document.querySelector('button[aria-label="Google Search"]'),
};

const searchTerm = elems.input.value.split(/^allintitle:/)[1];

if (searchTerm) {
  var resultsNum = elems.results
    ? +elems.results.innerText.match(/[0-9’]+/)[0].replace(/’/g, "")
    : elems.heading?.innerText.includes("did not match any documents")
    ? 0
    : undefined;

  chrome.storage.sync.get(["keywords-obj"], (items) => {
    const kwObj = items["keywords-obj"] || {};
    kwObj[searchTerm] = resultsNum;
    chrome.storage.sync.set({ "keywords-obj": kwObj });
  });
}
