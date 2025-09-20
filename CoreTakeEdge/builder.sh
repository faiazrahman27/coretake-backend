#!/bin/bash

# ===========================================
# CoreTake Backend Builder Script for Render
# ===========================================

echo "🚀 Starting build script..."

# Step 1: Move to backend folder
if [ -d "backend" ]; then
    cd backend
    echo "✅ Moved to backend folder"
else
    echo "❌ Error: backend folder not found!"
    exit 1
fi

# Step 2: Install Python dependencies
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies from requirements.txt..."
    pip install --upgrade pip
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Error installing dependencies"
        exit 1
    fi
else
    echo "❌ Error: requirements.txt not found!"
    exit 1
fi

# Step 3: Start the backend
if [ -f "app.py" ]; then
    echo "🚀 Starting backend server..."
    python app.py
else
    echo "❌ Error: app.py not found!"
    exit 1
fi
