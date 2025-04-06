#!/usr/bin/env bash

# Update package lists
apt-get update

# Install Tesseract OCR and its development libraries
apt-get install -y tesseract-ocr libtesseract-dev

# Optional: Install additional language packs if needed
apt-get install -y tesseract-ocr-eng

# Install Python dependencies
pip install -r requirements.txt
