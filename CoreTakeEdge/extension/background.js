chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    alert("CoreTake cannot summarize this page.");
    return;
  }

  chrome.scripting.executeScript(
    { target: { tabId: tab.id }, func: () => document.body.innerText },
    (results) => {
      if (!results || !results[0] || !results[0].result) {
        console.error("No page content available.");
        alert("CoreTake cannot read this page.");
        return;
      }

      let pageText = results[0].result;

      fetch("https://coretake-backend.onrender.com/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText })
      })
        .then(res => res.json())
        .then(data => {
          let summary = data.summary;
          let newTab = window.open();
          if (newTab) {
            newTab.document.write(`
              <html>
              <head>
                <title>Page Summary - CoreTake</title>
                <style>
                  body { font-family: Arial; margin: 40px; background: #f7f7f7; color: #333; }
                  h1 { color: #2c3e50; }
                  p { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
                </style>
              </head>
              <body>
                <h1>Page Summary</h1>
                <p>${summary}</p>
              </body>
              </html>
            `);
          } else {
            console.error("Failed to open a new tab.");
          }
        })
        .catch(err => {
          console.error("Error fetching summary:", err);
          alert("Failed to get summary from backend.");
        });
    }
  );
});
