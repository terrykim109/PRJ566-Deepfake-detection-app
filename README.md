# Deepfake Detection Application
## Sprint 4 Demo — Login, Account Creation, and Profile Pages with Firebase CRUD ##

## Overview

The Deepfake Detection Application is a web-based platform that helps users identify images that may have been manipulated or generated using AI. The goal of the project is to provide a secure, accessible, and easy-to-use screening tool for everyday users, content creators, small businesses, educators, and cybersecurity professionals.

As deepfake technology becomes more realistic and widely available, it is increasingly difficult for users to verify suspicious media by sight alone. This application aims to reduce that gap by allowing users to upload an image, receive an analysis result, and view a confidence score that helps them make informed decisions.

## Project Goals

- Build a functional full-stack web application
- Allow users to upload an image for deepfake analysis
- Return a clear result indicating whether the image appears real or manipulated
- Display a confidence score with the result
- Design a simple, secure, and user-friendly interface
- Minimize data retention and handle uploads safely

## Team 

- Rojin Osia - Backend Developer
- Nattharut Natvongsaku - Frontend Developer and UX/UI Designer
- Lucy Kwak - Product Research, Backend Development, and Frontend Support
- Terry Kim - Project Coordination, Backend Development, and System Integration


## Tech Stack

### Frontend
- TypeScript
- React 18
- Vite
- CSS3 

### Backend
- Python
- FastAPI
- Uvicorn

### Detection (Planned)
- OpenRouter API — vision model inference for media analysis and confidence scoring

### Storage & Auth (Planned)
- Firebase Authentication — email/password and Google OAuth login
- Firebase Firestore — user profiles and saved result metadata

### Detection Model (Planned)
- SightEngine API — pre-trained deepfake detection model integration
- PyTorch — custom model training and deployment

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 20.19+ or 22.12+ (required by Vite 8)

### 1. Clone the repository
```bash
git clone https://github.com/terrykim109/PRJ566-Deepfake-detection-app.git
cd PRJ566-Deepfake-detection-app
```

### 2. Start the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                # Runs on http://localhost:8000
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev                   # Runs on http://localhost:5173
```

The Vite dev server is configured to proxy `/api` requests to the backend on
port 8000. The frontend does not make any API calls yet, so the backend is not
required to run the UI.

See **[`frontend/README.md`](frontend/README.md)** for the frontend: the route ↔
Figma node map, the design tokens, and the deliberate deviations from the design.


