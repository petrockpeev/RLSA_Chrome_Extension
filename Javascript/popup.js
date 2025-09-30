const API_ROOT = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("modelSelect");
  const toggle = document.getElementById("themeToggle");

  chrome.storage.sync.get({ selectedModel: null, theme: "dark" }, (data) => {
    loadModels(data.selectedModel);
    applyTheme(data.theme);
    toggle.checked = data.theme === "light";
  });

  select.addEventListener("change", () => {
    chrome.storage.sync.set({ selectedModel: select.value });
  });

  toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "light" : "dark";
    chrome.storage.sync.set({ theme });
    applyTheme(theme);
  });

  async function loadModels(selected) {
    try {
      const res = await fetch(`${API_ROOT}/models`);
      if (!res.ok) throw new Error("Failed to fetch models");

      const items = await res.json();
      select.innerHTML = "";

      items.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.name;

        const typeMap = {
          "sklearn": "Machine Learning",
          "tensorflow": "Deep Learning"
        };

        function capitalizeModelName(name) {
          const acronymList = ["cnn", "lstm", "rnn", "svm"];

          if (acronymList.includes(name.toLowerCase())) {
            return name.toUpperCase();
          }
          
          return name
            .split("_")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }

        const prettyName = capitalizeModelName(m.name);
        const swapType = typeMap[m.type] || m.type;

        opt.textContent = `${prettyName} — ${swapType}`;
        select.appendChild(opt);
      });


      const toSelect = selected || (items[0] && items[0].name);
      if (toSelect) select.value = toSelect;

      chrome.storage.sync.set({ selectedModel: select.value });
    } catch (err) {
      select.innerHTML = `<option value="">(Backend unreachable)</option>`;
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.style.background = "#ffffff";
      document.body.style.color = "#111827";
      document.body.style.border = "2px solid #d1d5db";
    } else {
      document.body.style.background = "#141e24";
      document.body.style.color = "#f1f5f9";
      document.body.style.border = "2px solid #316e7d";
    }
  }
});
