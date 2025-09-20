// content.js
(() => {
  try {
    // Grab all visible text from the page
    let pageText = document.body.innerText || "";

    // Send the text back to background.js
    chrome.runtime.sendMessage({
      action: "PAGE_TEXT",
      text: pageText
    });
  } catch (err) {
    console.error("CoreTake content.js error:", err);
    chrome.runtime.sendMessage({
      action: "PAGE_TEXT",
      text: ""
    });
  }
})();
