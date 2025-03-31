# 🚨 Thief Detection System

The **Thief Detection System** is a facial recognition application built using **OpenCV**, **Flask**, and **React**. It identifies and recognizes faces, displaying their names and triggering an alarm if a thief is detected.

---

![Screenshot 2025-03-31 111719](https://github.com/user-attachments/assets/2a7e1927-ddc2-4146-bc13-5dd5e71b10b9)


## 🌟 Features

- **Real-time Face Detection:** Using OpenCV for live face detection.
- **Face Recognition:** Leveraging a pre-trained LBPH model.
- **Name Display:** Recognized individuals' names are displayed.
- **Thief Detection Alert:** An alarm is triggered if a thief is detected.
- **Image Upload:** Upload images of thieves using a zip file for retraining.
- **Responsive UI:** Seamless, user-friendly interface with a live camera feed.

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Flask
- **Face Recognition:** OpenCV (LBPH Face Recognizer)

---

## 📁 Project Structure

```bash
thief_detection/
│
├── backend/
│   ├── server.py           # Flask backend server
│   ├── dataset/            # Stores training images of thieves
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React App
│   │   ├── components/     # Header, MainContent, Footer, AddThiefModal
│   │   ├── services/       # API Service Functions
│   │   ├── App.css         # Styles
│
└── README.md
```

---

## 🧑‍💻 Prerequisites

Ensure you have the following installed:

- **Python 3.8+**
- **Node.js and npm**
- **OpenCV**
- **Flask**

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/nik-krish/thief_detection.git
cd thief_detection
```

### Backend Setup

1. Navigate to the backend folder:
    ```bash
    cd backend
    ```
2. Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the backend server:
    ```bash
    python server.py
    ```

### Frontend Setup

1. Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2. Install Node.js dependencies:
    ```bash
    npm install
    ```
3. Start the React app:
    ```bash
    npm start
    ```

---

## 🎯 Usage

1. Ensure your webcam is connected.
2. Start both the backend and frontend servers.
3. Open `http://localhost:3000` in your browser.
4. The system will detect faces and recognize known individuals.
5. If a thief is detected, an alert will be displayed.
6. Use the **"Add Thief"** button to upload a zip folder containing images of a thief for model retraining.

---

## 📡 API Endpoints

| Endpoint         | Method | Description                                        |
| ----------------- | ------ | -------------------------------------------------- |
| `/recognize`      | GET    | Fetches the current video frame                   |
| `/alerts`         | GET    | Retrieves the latest alert                        |
| `/status`         | GET    | Provides system status                            |
| `/upload_folder`  | POST   | Uploads a zip of thief images for model retraining|

---

## ⚙️ Configuration

- To add known faces, place images in the `dataset` directory with filenames as `name`.
- Adjust confidence thresholds and other settings in the `server.py` file.

---

## 🛡️ Troubleshooting

- Ensure Python and Node.js are installed correctly.
- Check camera permissions if the webcam is not detected.
- Verify the Flask server is running on `http://localhost:5000`.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For any issues or inquiries, contact **Nikhil Krishan** at [s.nikhilkrishnan@gmail.com](mailto:s.nikhilkrishnan@gmail.com).

---

