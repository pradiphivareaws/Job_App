#!/bin/bash

echo "================================"
echo "JobPortal Setup Script"
echo "================================"
echo ""

echo "This script will help you set up the JobPortal application."
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file for frontend..."
    cp .env.example .env
    echo "✓ Frontend .env created"
else
    echo "✓ Frontend .env already exists"
fi

if [ ! -f "backend/.env" ]; then
    echo "Creating .env file for backend..."
    cp backend/.env.example backend/.env
    echo "✓ Backend .env created"
else
    echo "✓ Backend .env already exists"
fi

echo ""
echo "Please edit the following files with your Supabase credentials:"
echo "  - .env (frontend)"
echo "  - backend/.env (backend)"
echo ""

read -p "Have you updated the .env files with your Supabase credentials? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please update the .env files and run this script again."
    exit 1
fi

echo ""
echo "Installing dependencies..."

echo "Installing frontend dependencies..."
npm install

echo ""
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To run the application locally:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
echo ""
echo "================================"
echo "Access the application at:"
echo "  http://localhost:5173 (dev)"
echo "  http://localhost:3000 (docker)"
echo "================================"
