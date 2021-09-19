const inputField = document.querySelector("#keywords");
const uploadButton = document.querySelector("#save-keywords");

uploadButton.addEventListener("click", function handleUploadClick(event) {
  const keywords = inputField.value;
  chrome.storage.sync.set({ "keywords-input": keywords });
  // read with `chrome.storage.sync.get(console.log);`
});
