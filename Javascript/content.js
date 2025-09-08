let analyzeButton = null;
let resultBox = null;

document.addEventListener("mouseup", function (e) {
  if (e.target.closest(".rsae-ui")) return;

  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    showAnalyzeButton(selectedText);
  }
});

function showAnalyzeButton(text) {
  if (analyzeButton) analyzeButton.remove();
  if (resultBox) resultBox.remove();

  analyzeButton = document.createElement("button");
  analyzeButton.innerHTML = `<img src="${chrome.runtime.getURL('double-arrow.png')}" 
    style="width:16px; height:16px; vertical-align:middle; margin-right:6px;"> Analyze`;
  analyzeButton.className = "rsae-ui";
  Object.assign(analyzeButton.style, {
    position: "absolute",
    zIndex: 9999,
    padding: "6px 12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3498db, #32a0eaff)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "background 0.2s ease",
  });

  analyzeButton.onmouseover = () => {
    analyzeButton.style.background = "linear-gradient(135deg, #3d8cc0ff, #32a0eaff)";
  };
  analyzeButton.onmouseout = () => {
    analyzeButton.style.background = "linear-gradient(135deg, #3498dbff, #51afeeff)";
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

async function analyzeText(text) {
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) return;

    const data = await response.json();
    showResultBox(data.sentiment);
  } catch {}
}

function showResultBox(sentiment) {
  if (resultBox) resultBox.remove();

  resultBox = document.createElement("div");
  resultBox.className = "rsae-ui";
  resultBox.innerHTML = `
    <span style="font-size:14px; font-weight:500;">Sentiment: <b style="color:#4CAF50;">${sentiment}</b></span>
    <button id="closeResult" style="
      margin-left:12px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    ">
      <img src="${chrome.runtime.getURL('cross.png')}" style="width:14px; height:14px;">
    </button>
  `;

  Object.assign(resultBox.style, {
    position: "absolute",
    zIndex: 9999,
    padding: "8px 14px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    fontFamily: "Arial, sans-serif",
  });

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
