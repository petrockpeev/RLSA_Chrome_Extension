document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection().toString().trim();
  console.log("User selected:", selection);

  // If user clicked the analyze button, don't remove it
  if (e.target.id === "analyze-btn") {
    return;
  }

  if (selection) {
    showAnalyzeButton(selection);
  } else {
    removeAnalyzeButton();
  }
});

function showAnalyzeButton(text) {
  removeAnalyzeButton();

  const button = document.createElement("button");
  button.innerText = "Analyze";
  button.id = "analyze-btn";

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  button.style.position = "absolute";
  button.style.top = `${rect.bottom + window.scrollY}px`;
  button.style.left = `${rect.right + window.scrollX + 5}px`;
  button.style.zIndex = 10000;  // make sure it's above everything

  button.onclick = (e) => {
    e.stopPropagation(); // prevent triggering mouseup again
    console.log("Analyze button clicked with text:", text);
    analyzeText(text);
  };

  document.body.appendChild(button);
}

function removeAnalyzeButton() {
  const oldBtn = document.getElementById("analyze-btn");
  if (oldBtn) oldBtn.remove();
}

async function analyzeText(text) {
  console.log("Sending request to Flask:", text);
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    console.log("Response status:", response.status);
    const result = await response.json();
    console.log("Flask response:", result);

    alert("Sentiment: " + result.sentiment);
  } catch (err) {
    console.error("Error analyzing sentiment:", err);
    alert("Error: " + err.message);
  }
}
