# EALMS Frontend (React + Bootstrap 5)

## Run it
1. Install Node.js (LTS) from https://nodejs.org
2. Open this folder in VS Code, open the terminal, then:

       npm install
       npm run dev

3. Open http://localhost:3000

## Backend address
Edit `.env` if your Django server is not at http://127.0.0.1:8000

## Django settings needed (backend)
Install django-cors-headers and allow the frontend:

    CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
