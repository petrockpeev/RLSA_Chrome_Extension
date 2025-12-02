const currentTheme = "dark";

let analyzeButton = null;
let resultBox = null;

document.addEventListener("mouseup", function (e) {
  if (e.target.closest(".rlsa-ui")) return;

  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    showAnalyzeButton(selectedText);
  }
});

function getThemeStyles(type) {
  if (type === "button") {
    return {
      background: "#1f2933",
      color: "#f1f5f9",
      border: "2px solid #316e7d"
    };
  } else if (type === "box") {
    return {
      background: "#141e24",
      color: "#f1f5f9",
      border: "2px solid #316e7d"
    };
  }
}


function showAnalyzeButton(text) {
  if (analyzeButton) analyzeButton.remove();
  if (resultBox) resultBox.remove();

  analyzeButton = document.createElement("button");
  analyzeButton.innerHTML = `<img src="${chrome.runtime.getURL('arrow.png')}" 
    style="width:20px; height:20px; vertical-align:middle; margin-right:6px;"> Analyze`;
  analyzeButton.className = "rlsa-ui";
  Object.assign(analyzeButton.style, {
    position: "absolute",
    zIndex: 9999,
    padding: "6px 12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    transition: "all 0.2s ease"
  }, getThemeStyles("button"));

  analyzeButton.onmouseover = () => {
    analyzeButton.style.background = "#24363f";
    analyzeButton.style.borderColor = "#4fd1c5";
  };

  analyzeButton.onmouseout = () => {
    const btnStyles = getThemeStyles("button");
    analyzeButton.style.background = btnStyles.background;
    analyzeButton.style.borderColor = btnStyles.border.split(" ")[2];
  };


  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    analyzeButton.style.top = window.scrollY + rect.bottom + "px";
    analyzeButton.style.left = window.scrollX + rect.right + 10 + "px";
  }

  analyzeButton.onmousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  analyzeButton.onclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    analyzeText(text);
  };

  document.body.appendChild(analyzeButton);
}

async function analyzeText(text, rect) {
  const selectedModel = await new Promise((resolve) => {
    chrome.storage.sync.get({ selectedModel: "default" }, (data) => { resolve(data.selectedModel); });
  });

  try {
    const resp = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, model: selectedModel })
    });

    if (!resp.ok) {
      showResultBox("Server error", 0);
      return;
    }

    const data = await resp.json();
    const sentiment = data.sentiment || "Unknown";
    const confidence = typeof data.confidence === "number" ? data.confidence : null;
    showResultBox(sentiment, confidence);
  } catch (err) {
    showResultBox("Server error", 0);
  }
}

function showResultBox(sentiment, confidence) {
  if (resultBox) resultBox.remove();

  let color;
  if (sentiment.toLowerCase() === "positive") {
    color = "#4CAF50";
  } else if (sentiment.toLowerCase() === "negative") {
    color = "#f44336";
  } else {
    color = "#b6b6b6ff";
  }

  resultBox = document.createElement("div");
  resultBox.className = "rlsa-ui";
  resultBox.innerHTML = `
  <button id="closeResult" style="
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  ">
    <img src="${chrome.runtime.getURL('cross.png')}" style="width:12px; height:12px;">
  </button>
  <div style="font-size:14px; font-weight:500; margin-top:3.5px; margin-right:12px;">
    Sentiment: <b style="color:${color};">${sentiment}</b>
  </div>
  <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">
    Confidence: ${(confidence * 100).toFixed(2)}%
  </div>

  </div>
  `;


  Object.assign(resultBox.style, {
    position: "absolute",
    zIndex: 9999,
    padding: "12px 14px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    minWidth: "160px",
    maxWidth: "240px",
    boxSizing: "border-box"
  }, getThemeStyles("box"));

  

  const rect = analyzeButton.getBoundingClientRect();
  resultBox.style.top = window.scrollY + rect.bottom + 5 + "px";
  resultBox.style.left = window.scrollX + rect.left + "px";

  document.body.appendChild(resultBox);

  analyzeButton.remove();
  analyzeButton = null;

  document.getElementById("closeResult").onclick = () => {
    resultBox.remove();
    resultBox = null;
  };
}
