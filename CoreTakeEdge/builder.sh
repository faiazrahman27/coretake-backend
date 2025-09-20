#!/bin/bash

echo "🚀 Starting build script..."

# Step 1: Move to CoreTakeEdge/backend folder
if [ -d "CoreTakeEdge/backend" ]; then
    cd CoreTakeEdge/backend
    echo "✅ Moved to CoreTakeEdge/backend folder"
else
    echo "❌ Error: CoreTakeEdge/backend folder not found!"
    exit 1
fi

# Step 2: Install Python dependencies
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
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
