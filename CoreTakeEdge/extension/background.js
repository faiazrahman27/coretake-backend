chrome.action.onClicked.addListener((tab) => {
  // Make sure the tab is a normal webpage
  if (!tab || !tab.id || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    console.error("Cannot summarize internal browser pages.");
    alert("CoreTake cannot summarize this page.");
    return;
  }

  // Extract page text
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => document.body.innerText
    },
    (results) => {
      if (!results || !results[0]) {
        console.error("No page content available.");
        alert("Unable to read page content.");
        return;
      }

      let pageText = results[0].result;

      // Send text to your live backend
      fetch("https://coretake-backend.onrender.com/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText })
      })
        .then(res => res.json())
        .then(data => {
          let summary = data.summary;

          // Open a new tab with a styled summary
          let newTab = window.open();
          if (newTab) {
            newTab.document.write(`
              <html>
              <head>
                <title>Page Summary - CoreTake</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; background: #f7f7f7; color: #333; }
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
