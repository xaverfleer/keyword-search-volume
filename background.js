console.log("Hello background");

chrome.tabs.create({
  url: "https://www.google.com/search?q=allintitle:Hello World",
});
