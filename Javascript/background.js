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
        badgeColor = "#4CAF50";
        break;
      case "negative":
        badgeText = "NEG";
        badgeColor = "#F44336";
        break;
      case "neutral":
        badgeText = "NEU";
        badgeColor = "#abababff";
        break;
    }

    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  }
});
