# 🚦 TrafficUndo – AI-Powered Kerala Traffic & Emergency Route Assistance System

## 📌 Overview

TrafficUndo is an intelligent traffic monitoring and community-driven reporting platform designed to help citizens navigate traffic congestion, roadblocks, floods, accidents, and other transportation disruptions across Kerala.

The system combines real-time traffic reports, district-wise live chat, AI-powered traffic insights, and emergency route assistance to provide users with accurate road condition information and alternative travel suggestions.

TrafficUndo enables citizens to collaboratively share road updates while helping emergency responders, commuters, and authorities make informed travel decisions.

---

## 🎯 Objectives

* Provide real-time traffic updates across Kerala.
* Enable district-wise community reporting.
* Support emergency route planning.
* Reduce travel delays caused by congestion.
* Improve public awareness during floods, accidents, and roadblocks.
* Facilitate live communication between road users.

---

## ✨ Features

### 🚧 Real-Time Traffic Reports

Users can submit traffic reports regarding:

* Traffic jams
* Road accidents
* Flooded roads
* Road construction
* Vehicle breakdowns
* Blocked routes

---

### 🗺️ District-Wise Monitoring

The platform supports all districts of Kerala and allows users to:

* View district-specific traffic conditions
* Track traffic severity levels
* Access recent reports

---

### 💬 Live District Chat

Integrated Socket.IO powered real-time chat allows users to:

* Join district-specific chat rooms
* Share road updates instantly
* Receive live notifications
* Collaborate with nearby commuters

---

### 🤖 AI Traffic Analysis

The AI module analyzes traffic reports and patterns to:

* Identify congestion hotspots
* Predict traffic trends
* Detect recurring road issues
* Suggest optimized travel routes

---

### 🚑 Emergency Route Assistance

Emergency services and citizens can:

* Find alternative routes
* Avoid blocked roads
* Navigate during floods and disasters
* Reach destinations faster

---

### 📊 Analytics Dashboard

Provides insights such as:

* Traffic density trends
* Most affected districts
* Accident statistics
* Road closure reports
* Community activity metrics

---

## 🏗️ System Architecture

### Frontend

* React.js
* Vite
* Axios
* Socket.IO Client
* Leaflet / OpenStreetMap
* CSS3

### Backend

* Python Flask
* Flask-SQLAlchemy
* Flask-CORS
* Flask-SocketIO

### Database

* SQLite

### AI Module

* Python
* Traffic Pattern Analysis
* Congestion Prediction
* Route Optimization Logic

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

## ⚙️ Installation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

### Backend Setup

Create virtual environment:

```bash
cd backend

python -m venv venv
```

Activate environment:

Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
python app.py
```

Backend runs at:

```text
http://127.0.0.1:5000
```

---

## 🔌 API Status Check

Open:

```text
http://127.0.0.1:5000
```

Expected Response:

```json
{
  "message": "TrafficUndo API Running",
  "realtime": "Socket.IO enabled"
}
```

---

## 🔒 Future Enhancements

* Google Maps Integration
* AI Accident Prediction
* Voice-Based Traffic Reporting
* SOS Emergency Alert System
* Ambulance Route Optimization
* Government Traffic Control Dashboard
* Push Notifications
* Weather Impact Analysis

---

## 👨‍💻 Developed By

Pranav Eswar

TrafficUndo – Smart Traffic Monitoring & Emergency Route Assistance Platform for Kerala.
