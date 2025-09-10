from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

vectorizer = joblib.load("models/tfidf_vectorizer.obj")
classifier = joblib.load("models/best_sentiment_model.obj")

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        features = vectorizer.transform([text])
        prediction = classifier.predict(features)[0]

        if hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(features)[0]
            class_index = list(classifier.classes_).index(prediction)
            confidence = float(probs[class_index])
        else:
            confidence = 1.0 # fallback if model has no probabilities

        return jsonify({
            "sentiment": str(prediction),
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
