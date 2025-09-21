import os
import json
import joblib
import numpy as np
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow import keras
from keras.preprocessing.sequence import pad_sequences
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

app = Flask(__name__)
CORS(app)

# ---------- DL Labels ----------
# For CNN, LSTM, and RNN models
LABEL_MAP = {
    0: "Negative",
    1: "Neutral",
    2: "Positive"
}

# ---------- Preprocessing ----------
def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove non-alphabetic characters
    text = re.sub(r"[^a-z\s]", "", text)
    # Remove stopwords
    tokens = [word for word in text.split() if word not in ENGLISH_STOP_WORDS]
    return " ".join(tokens)

# ---------- Model Loader ----------
MODELS_CONFIG = "models_config.json"
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
model_registry = {}

def load_models():
    config_path = os.path.join(MODEL_DIR, MODELS_CONFIG)
    if not os.path.exists(config_path):
        print("models_config.json not found")
        return

    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    for name, meta in cfg.items():
        mtype = meta.get("type", "")
        try:
            if mtype == "sklearn":
                model = joblib.load(os.path.join(MODEL_DIR, meta["model_path"]))
                vectorizer = joblib.load(os.path.join(MODEL_DIR, meta["vectorizer_path"]))
                model_registry[name] = {
                    "type": "sklearn",
                    "model": model,
                    "vectorizer": vectorizer,
                    "meta": meta
                }

            elif mtype == "tensorflow":
                model = keras.models.load_model(os.path.join(MODEL_DIR, meta["model_path"]))
                tokenizer = joblib.load(os.path.join(MODEL_DIR, meta["tokenizer_path"]))
                model_registry[name] = {
                    "type": "tensorflow",
                    "model": model,
                    "tokenizer": tokenizer,
                    "meta": meta
                }

            else:
                print(f"Unknown model type for {name}: {mtype}")
        except Exception as e:
            print(f"Failed to load {name}: {e}")

load_models()

# ---------- Routes ----------
@app.route("/models", methods=["GET"])
def list_models():
    return jsonify([
        {
            "name": k,
            "type": v["type"],
            "desc": v["meta"].get("desc", "")
        }
        for k, v in model_registry.items()
    ])

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)
    text = data.get("text", "")
    model_name = data.get("model", "default")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if model_name not in model_registry:
        return jsonify({"error": f"Model '{model_name}' not found"}), 400

    entry = model_registry[model_name]
    clean_text = preprocess_text(text)

    try:
        if entry["type"] == "sklearn":
            vec = entry["vectorizer"].transform([clean_text])
            model = entry["model"]
            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(vec)[0]
                idx = int(np.argmax(probs))
                label = model.classes_[idx]
                conf = float(probs[idx])
            else:
                label = model.predict(vec)[0]
                conf = 1.0

        elif entry["type"] == "tensorflow":
            tokenizer = entry["tokenizer"]
            seqs = tokenizer.texts_to_sequences([clean_text])
            padded = pad_sequences(seqs, maxlen=100)
            probs = entry["model"].predict(padded)[0]
            idx = int(np.argmax(probs))
            label = LABEL_MAP.get(idx, str(idx))
            conf = float(probs[idx])


        else:
            return jsonify({"error": "Unsupported model type"}), 500

        return jsonify({"sentiment": str(label), "confidence": conf})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
