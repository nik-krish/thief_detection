from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import cv2
import numpy as np
import os
from datetime import datetime
import threading
import time
from werkzeug.utils import secure_filename
import zipfile
import io

app = Flask(__name__)
CORS(app)

# Configuration
HAAR_FILE = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
DATASET_DIR = 'dataset'
THIEF_DETECTION_THRESHOLD = 10
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize face cascade classifier
try:
    face_cascade = cv2.CascadeClassifier(HAAR_FILE)
    if face_cascade.empty():
        raise ValueError("Could not load face cascade classifier")
    print("Face cascade classifier loaded successfully")
except Exception as e:
    print(f"Error loading face cascade: {e}")
    face_cascade = None

class SystemState:
    def __init__(self):
        self.current_frame = None
        self.latest_alert = None
        self.thief_names = []
        self.camera_ready = False
        self.model_trained = False
        self.model = None

system_state = SystemState()
frame_lock = threading.Lock()

def train_model():
    print('Training model with thief images...')
    images, labels, names, label_id = [], [], {}, 0

    for thief_name in os.listdir(DATASET_DIR):
        thief_dir = os.path.join(DATASET_DIR, thief_name)
        if not os.path.isdir(thief_dir):
            continue
            
        names[label_id] = thief_name
        system_state.thief_names.append(thief_name)
        
        for filename in os.listdir(thief_dir):
            img_path = os.path.join(thief_dir, filename)
            img = cv2.imread(img_path, 0)
            if img is not None:
                img = cv2.resize(img, (130, 100))
                images.append(img)
                labels.append(label_id)
        
        label_id += 1

    if len(images) == 0:
        print("Error: No training images found")
        return False, None

    model = cv2.face.LBPHFaceRecognizer_create()
    model.train(np.array(images), np.array(labels))
    return True, model

def capture_frames():
    global system_state, face_cascade
    
    if face_cascade is None:
        print("Cannot start - face cascade not loaded")
        return

    for cam_index in [1, 0]:
        webcam = cv2.VideoCapture(cam_index)
        if webcam.isOpened():
            print(f"Webcam found at index {cam_index}")
            break
    else:
        print("Error: Could not open any webcam")
        return

    training_success, model = train_model()
    
    with frame_lock:
        system_state.model_trained = training_success
        system_state.model = model
        system_state.camera_ready = True

    while True:
        ret, frame = webcam.read()
        if not ret:
            time.sleep(0.1)
            continue
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            face = gray[y:y + h, x:x + w]
            face_resize = cv2.resize(face, (130, 100))
            
            if system_state.model_trained and system_state.model:
                label_id, confidence = system_state.model.predict(face_resize)
                confidence_percent = 100 - confidence
                
                if confidence_percent > THIEF_DETECTION_THRESHOLD:
                    thief_name = system_state.thief_names[label_id]
                    alert_msg = f"THIEF DETECTED: {thief_name} (Confidence: {confidence_percent:.1f}%) at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                    
                    with frame_lock:
                        system_state.latest_alert = alert_msg
                    
                    print(alert_msg)
                    color = (0, 0, 255)
                else:
                    color = (0, 255, 0)
                    thief_name = "Unknown"
                
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, f"{thief_name} ({confidence_percent:.1f}%)", 
                          (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        with frame_lock:
            system_state.current_frame = frame

if face_cascade is not None:
    threading.Thread(target=capture_frames, daemon=True).start()

@app.route('/recognize', methods=['GET'])
def recognize():
    with frame_lock:
        if not system_state.camera_ready or system_state.current_frame is None:
            return jsonify({'error': 'Camera not ready'}), 503
            
        _, buffer = cv2.imencode('.jpg', system_state.current_frame)
        return Response(buffer.tobytes(), mimetype='image/jpeg')

@app.route('/alerts', methods=['GET'])
def get_alerts():
    with frame_lock:
        alert = system_state.latest_alert
        system_state.latest_alert = None
    return jsonify({'alert': alert}) if alert else jsonify({'alert': None})

@app.route('/status', methods=['GET'])
def get_status():
    with frame_lock:
        return jsonify({
            'status': 'READY' if system_state.camera_ready and system_state.model_trained else 'SETUP',
            'camera': 'Connected' if system_state.camera_ready else 'Disconnected',
            'model': 'Trained' if system_state.model_trained else 'Not Trained',
            'known_thieves': system_state.thief_names,
            'detection_threshold': THIEF_DETECTION_THRESHOLD
        })

@app.route('/upload_folder', methods=['POST'])
def upload_folder():
    if 'folder' not in request.files or 'thief_name' not in request.form:
        return jsonify({'error': 'Missing zip file or thief name'}), 400
        
    zip_file = request.files['folder']
    thief_name = request.form['thief_name'].strip()
    
    if zip_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not thief_name:
        return jsonify({'error': 'Thief name cannot be empty'}), 400
        
    if zip_file and zip_file.filename.endswith('.zip'):
        thief_dir = os.path.join(DATASET_DIR, thief_name)
        os.makedirs(thief_dir, exist_ok=True)
        
        try:
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                # Extract only allowed image files
                for file in zip_ref.namelist():
                    if allowed_file(file):
                        file_data = zip_ref.read(file)
                        filename = secure_filename(os.path.basename(file))
                        filepath = os.path.join(thief_dir, filename)
                        with open(filepath, 'wb') as f:
                            f.write(file_data)
            
            # Retrain model with new images
            training_success, model = train_model()
            with frame_lock:
                system_state.model_trained = training_success
                system_state.model = model
                if thief_name not in system_state.thief_names:
                    system_state.thief_names.append(thief_name)
            
            return jsonify({
                'message': 'Folder uploaded successfully',
                'thief_name': thief_name,
                'images_added': len(os.listdir(thief_dir))
            })
            
        except Exception as e:
            return jsonify({'error': f'Error processing zip file: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload a ZIP file'}), 400

if __name__ == '__main__':
    os.makedirs(DATASET_DIR, exist_ok=True)
    app.run(host='0.0.0.0', port=5000, threaded=True)