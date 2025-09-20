chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body.innerText
  }, (results) => {
    let pageText = results[0].result;

    // ----------------------
    // LOCAL TESTING:
    // fetch("http://127.0.0.1:5000/summarize", {
    // ----------------------

    // ----------------------
    // ONLINE RENDER BACKEND:
    fetch("https://coretake-backend.onrender.com", {
    // ----------------------

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: pageText })
    })
    .then(res => res.json())
    .then(data => {
      let summary = data.summary;
      let newTab = window.open();
      newTab.document.write("<h1>Page Summary</h1><p>" + summary + "</p>");
    })
    .catch(err => console.error("Error:", err));
  });
});

