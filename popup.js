const inputField = document.querySelector("#keywords");
const uploadButton = document.querySelector("#save-keywords");

uploadButton.addEventListener("click", function handleUploadClick(event) {
  const keywords = inputField.value;
  chrome.storage.sync.set({ "keywords-input": keywords });

  {
    const keywordArrRaw = keywords.split(",");
    const keywordArr = keywordArrRaw.map((k) => k.trim());
    const keywordObj = {};

    chrome.storage.sync.set({ "keywords-arr": keywordArr });
    chrome.storage.sync.set({ "keywords-obj": keywordObj });
  }
});
