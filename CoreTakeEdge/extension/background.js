chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab || !tab.id || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      console.log("CoreTake cannot summarize internal browser pages.");
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    });

    if (!results || !results[0] || !results[0].result) {
      console.error("No page content available.");
      return;
    }

    let pageText = results[0].result;

    // truncate long text to avoid backend issues
    if (pageText.length > 20000) pageText = pageText.slice(0, 20000);

    const response = await fetch("https://coretake-backend.onrender.com/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: pageText })
    });

    const data = await response.json();
    const summary = data.summary;

    // Open new tab with summary
    chrome.tabs.create({
      url: "data:text/html," + encodeURIComponent(`
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
      `)
    });

  } catch (err) {
    console.error("Error in CoreTake extension:", err);
  }
});
