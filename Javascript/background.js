chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: "#555" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.sentiment) {
    let badgeText = "";
    let badgeColor = "#555";

    switch (message.sentiment.toLowerCase()) {
      case "positive":
        badgeText = "POS";
        badgeColor = "#4CAF50"; // green
        break;
      case "negative":
        badgeText = "NEG";
        badgeColor = "#F44336"; // red
        break;
      case "neutral":
        badgeText = "NEU";
        badgeColor = "#FFC107"; // amber
        break;
    }

    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  }
});
