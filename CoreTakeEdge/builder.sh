#!/bin/bash

# Move to backend folder
cd backend || { echo "Backend folder not found!"; exit 1; }

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
