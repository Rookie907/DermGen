from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from model import generate_images

app = Flask(__name__)
CORS(app)

# Map disease class strings to integer indices
DISEASE_CLASS_MAP = {
    'AKIEC': 0,
    'DF': 1,
    'VASC': 2
}

@app.route('/generate', methods=['POST', 'OPTIONS'])
def generate():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    disease_str = data.get('disease')
    count = int(data.get('count', 4))

    # Convert string label to integer index
    disease_index = DISEASE_CLASS_MAP.get(disease_str)
    if disease_index is None:
        return jsonify({'error': f'Unknown disease class: {disease_str}'}), 400

    images = generate_images(disease_index, count)

    encoded_images = []
    for img_path in images:
        with open(img_path, 'rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            encoded_images.append(encoded)

    return jsonify({'images': encoded_images})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)