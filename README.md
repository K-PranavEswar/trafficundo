# 🚦 TrafficUndo 

[![React](https://img.shields.io/badge/Frontend-React.js-blue?style=flat&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?style=flat&logo=flask)](https://flask.palletsprojects.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black?style=flat&logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **An AI-Powered Kerala Traffic & Emergency Route Assistance System**

**TrafficUndo** is an intelligent traffic monitoring and community-driven reporting platform designed to help citizens navigate traffic congestion, roadblocks, floods, accidents, and other transportation disruptions across Kerala.

By combining real-time traffic reports, district-wise live chat, AI-powered traffic insights, and emergency route assistance, TrafficUndo provides users with accurate road condition information and alternative travel suggestions.

<img width="1902" height="902" alt="TrafficUndo Dashboard Preview" src="https://github.com/user-attachments/assets/857b88a6-9fd6-429b-8b28-ef03a5cf2062" />

---

## 🎯 Objectives

*   **Real-Time Awareness:** Provide live traffic updates across all districts of Kerala.
*   **Community Collaboration:** Enable district-wise reporting and peer-to-peer chat.
*   **Emergency Assistance:** Support emergency route planning to bypass roadblocks.
*   **Congestion Reduction:** Minimize travel delays caused by heavy traffic or accidents.
*   **Disaster Management:** Improve public awareness during floods, landslides, and major road accidents.

---

## ✨ Key Features

### 🚧 Real-Time Traffic Reports
Users can actively submit and view traffic reports regarding:
*   Traffic jams & severe congestion
*   Road accidents & vehicle breakdowns
*   Flooded or damaged roads
*   Ongoing road construction
*   Blocked or restricted routes

### 🗺️ District-Wise Monitoring
The platform is optimized for Kerala's geography, allowing users to:
*   View district-specific traffic conditions instantly.
*   Track traffic severity levels via an interactive UI.
*   Access a localized feed of recent reports.

### 💬 Live District Chat
Integrated **Socket.IO** powered real-time chat allows commuters to:
*   Join district-specific chat rooms (e.g., Thiruvananthapuram, Ernakulam, Kozhikode).
*   Share dynamic road updates instantly.
*   Receive live notifications and collaborate with nearby travelers.

### 🤖 AI Traffic Analysis
An intelligent AI backend processes community reports to:
*   Identify and map congestion hotspots.
*   Predict upcoming traffic trends based on historical data.
*   Detect recurring road issues in specific areas.
*   Suggest optimized travel routes for daily commuters.

### 🚑 Emergency Route Assistance
Designed to help emergency services (ambulances, fire brigade) and citizens:
*   Find fast, alternative routes during crises.
*   Avoid blocked roads or severely flooded zones.
*   Reach critical destinations faster during golden hours.

### 📊 Analytics Dashboard
Provides stakeholders with actionable insights:
*   Traffic density trends over time.
*   Most affected districts and incident statistics.
*   Road closure reports and community activity metrics.

---

## 🏗️ System Architecture & Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Vite, Axios, Socket.IO Client, Leaflet / OpenStreetMap, CSS3 |
| **Backend** | Python Flask, Flask-SQLAlchemy, Flask-CORS, Flask-SocketIO |
| **Database** | SQLite |
| **AI Module** | Python, Traffic Pattern Analysis, Route Optimization Logic |

---

## 📂 Project Structure

```text
TrafficUndo/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── ai/
│   ├── database/
│   ├── app.py
│   ├── routes.py
│   ├── models.py
│   ├── kerala_data.py
│   └── requirements.txt
│
└── README.md

```

---

## ⚙️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v16 or higher)
* **Python** (v3.8 or higher)
* **Git**

### 1. Frontend Setup

Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm install
npm run dev

```

> **Note:** The frontend will typically run at `http://localhost:5173`

### 2. Backend Setup

Open a new terminal window, navigate to the backend directory, and create a virtual environment:

```bash
cd backend
python -m venv venv

```

**Activate the virtual environment:**

* **Windows:** `venv\Scripts\activate`
* **macOS/Linux:** `source venv/bin/activate`

**Install dependencies and run the server:**

```bash
pip install -r requirements.txt
python app.py

```

> **Note:** The backend API will run at `http://127.0.0.1:5000`

---

## 🔌 API Status Check

To verify the backend is running correctly, open your browser or Postman and navigate to:

```text
[http://127.0.0.1:5000](http://127.0.0.1:5000)

```

**Expected JSON Response:**

```json
{
  "message": "TrafficUndo API Running",
  "realtime": "Socket.IO enabled"
}

```

---

## 🚀 Future Enhancements

* **Google Maps API Integration:** For enhanced real-time navigation.
* **AI Accident Prediction:** Utilizing machine learning to predict high-risk zones based on weather and time.
* **Voice-Based Reporting:** Hands-free traffic reporting for drivers.
* **SOS Emergency Alert System:** Direct ping to local authorities and hospitals.
* **Ambulance Route Optimization:** Dedicated routing dashboard for emergency vehicles.
* **Government Traffic Control Dashboard:** Specialized portal for Kerala Police and MVD.
* **Weather Impact Analysis:** Integrating IMD data for flood/landslide predictions.

---

## 👨‍💻 Developed By

**Pranav Eswar**

*TrafficUndo – Smart Traffic Monitoring & Emergency Route Assistance Platform for Kerala.*

```
