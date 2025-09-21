const API_ROOT = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("modelSelect");

  chrome.storage.sync.get({ selectedModel: null }, (data) => {
    loadModels(data.selectedModel);
  });

  select.addEventListener("change", () => {
    chrome.storage.sync.set({ selectedModel: select.value });
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
});
