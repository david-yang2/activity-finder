# Activity Finder

A full-stack web application that suggests unique, local activities based on user input, location, and weather. The app leverages AI and web search to recommend special events (concerts, festivals, pop-ups, etc.) happening nearby, prioritizing unique experiences over generic suggestions.

Hosted on Render: [Activity Finder](https://activity-finder-y76q.onrender.com/)

## Features
- AI-powered activity suggestions tailored to user prompt, location, and weather
- Prioritizes special events and unique experiences
- Filters activities by date (today, tomorrow, weekend) and distance
- Responsive React frontend styled with Tailwind CSS
- Express.js backend with secure API endpoint


## Tech Stack
- React (Vite)
- Express.js
- Tailwind CSS
- OpenAI/Groq API for AI suggestions
- Helmet & CORS for backend security

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

## Usage
- Enter a prompt describing your interests, location, and any preferences (e.g., "It's sunny in San Francisco, looking for something fun to do outside with friends").
- Select a search radius (5, 10, 15, or 25 miles).
- Submit to receive a list of a maximum of 5 curated activities and events.


## Known Issues
- **Excessive input tokens used when web searching. Rate limit threshold reached too quickly.**
  - The AI model may hit token or rate limits if user prompts are too long or if too many requests are made in a short period. Please try again after waiting, or shorten your input.
