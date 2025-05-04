# EmailSequencer

A full-stack MERN application to visually create and schedule email sequences using React Flow, Agenda, and Nodemailer.

## Features
- Drag and drop flowchart with Cold Email, Wait/Delay, and Lead Source nodes
- Schedule emails using Agenda
- Send emails with Nodemailer
- Clean React Vite structure

## Stack
- Frontend: React + Vite + React Flow
- Backend: Node.js + Express + Agenda + Nodemailer + MongoDB

## Installation

### Backend
npm init -y
npm install express mongoose nodemailer agenda cors dotenv
npm install nodemon

### Frontend
npm create vite@latest 
npm install @xyflow/react
npm install react-flow axios
npm install tailwindcss postcss autoprefixer -D
npx tailwindcss init -p
