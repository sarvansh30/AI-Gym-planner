💪 AI Fitness Coach

A comprehensive, AI-powered personal training application built with Next.js 14. This app acts as a virtual coach, generating personalized workout routines and diet plans based on user biometrics and goals using Google's Gemini models. It features immersive elements like AI image generation for exercises/meals and Text-to-Speech audio guidance via ElevenLabs.

🚀 Features

🧠 Intelligent Plan Generation

Personalized Logic: Uses Gemini 2.5 Flash to generate strict JSON-structured plans based on user inputs (Age, Weight, Goal, Equipment, Dietary Prefs).

Detailed Workouts: Sets, reps, rest times, and form cues tailored to the user's experience level.

Nutrition Breakdown: Meal-by-meal diet plans with macro estimates and ingredients.

👁️ Visual & Audio Immersion

AI Image Visualization: Click "Visualize" on any exercise or meal to generate a reference image.

Primary: Uses Gemini 2.5 Flash Image.

Fallback: Auto-switches to Pollinations.ai if API quotas are exceeded to ensure stability.

Text-to-Speech (TTS): Listen to your workout or diet plan using realistic AI voices powered by ElevenLabs.

⚡ Dashboard & Utility

Daily Motivation: A "Living" dashboard that fetches fresh motivational quotes and actionable habits every 60 seconds.

PDF Export: Download the entire fitness blueprint as a clean, printable PDF.

Local Persistence: Plans are saved to local storage so users don't lose data on refresh.

🛠️ Tech Stack

Framework: Next.js 14 (App Router)

Language: TypeScript

Styling: Tailwind CSS & Shadcn UI

AI Provider: Google GenAI SDK (Gemini 2.5)

Voice Provider: ElevenLabs SDK

Forms & Validation: React Hook Form + Zod

Animations: Framer Motion

PDF Generation: React-to-print

⚙️ Getting Started

Follow these steps to run the project locally.

1. Clone the repository

git clone [https://github.com/sarvansh30/AI-Gym-planner](https://github.com/sarvansh30/AI-Gym-planner)
cd ai-fitness-coach


2. Install Dependencies

npm install
# or
yarn install


3. Configure Environment Variables

Create a .env.local file in the root directory. You need API keys for the AI features to work.

# Google Gemini API Key (Required for Plans & Images)
GEMINI_API_KEY=your_google_api_key_here

# ElevenLabs API Key (Required for Audio Features)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here


4. Run the Development Server

npm run dev


Open http://localhost:3000 with your browser to see the result.

📖 Usage Guide

Input Data: Fill out the form with your personal details (Name, Age, Gender, etc.) and fitness preferences (Goal, Equipment, Diet).

Generate: Click "Generate My Plan". The AI will take 5-10 seconds to craft your routine.

Dashboard: Once generated, you will be redirected to your personal dashboard.

Visualize: Click the Camera Icon next to any item to see what it looks like.

Listen: Click the Speaker Icon (Read Workout/Diet) to hear your plan.

Download: Click "Download PDF" to save a copy.

📂 Project Structure
```
src/
├── app/
│   ├── actions/          # Server Actions (Gemini & ElevenLabs logic)
│   └── page.tsx          # Main entry point (State management)
├── components/
│   ├── forms/            # Zod-validated User Input Form
│   ├── plans/            # Dashboard, Visualizers, and Audio Players
│   └── ui/               # Reusable Shadcn components
├── lib/
│   └── schemas.ts        # Zod schemas and TS Types
└── types/                # Global type definitions
```

This is a Next.js project bootstrapped with create-next-app.

Learn More

To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.

Learn Next.js - an interactive Next.js tutorial.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!