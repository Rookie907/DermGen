from flask import Flask, request, jsonify
from flask_cors import CORS
from model import generate_images
import base64

app = Flask(__name__)
CORS(app)

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        disease_input = data.get("disease")
        count = data.get("count")

        if disease_input is None or count is None:
            return jsonify({"error": "Both 'disease' and 'count' are required."}), 400

        # Map string labels to integers for the model
        mapping = {
            "AKIEC": 0,
            "DF": 1,
            "VASC": 2
        }

        if isinstance(disease_input, str):
            disease = mapping.get(disease_input)
            if disease is None:
                return jsonify({"error": f"Invalid disease class: {disease_input}"}), 400
        else:
            disease = disease_input

        images = generate_images(disease, count)
        # Convert all images to base64
        encoded_images = []
        for img_path in images:
            with open(img_path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode("utf-8")
                encoded_images.append(encoded)

        return jsonify({"images": encoded_images})  # always base64 strings

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)