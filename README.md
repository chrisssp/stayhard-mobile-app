# StayHard — AI-Powered Daily Motivation

<p align="center">
  <img src="https://img.shields.io/badge/Expo-53-000020?logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/React_Native-0.79-61DAFB?logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/License-GPL_v3-0298c3?logo=gnu&logoColor=white" alt="GPL v3">
</p>

<p align="center">
  <em>Motivational app to organize your daily life and stay on track to move forward</em>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <a href="README.es.md">🇪🇸 Español</a>
</p>

---

## About StayHard

A cross-platform mobile application that helps you organize your daily life, build discipline, and stay motivated. Powered by Supabase for backend services and Google Gemini AI for intelligent coaching and personalized daily planning.

## Features

- AI-powered conversational interface with Gemini for motivation and guidance
- Daily planning and task organization
- Real-time data sync via Supabase
- Native bottom tab navigation
- Modern UI with NativeWind and Heroicons
- Haptic feedback and animations
- Cross-platform (iOS, Android, Web)

## Quick Start

### Prerequisites

- Node.js 18+
- Expo Go (on device) or Android Studio / Xcode
- Supabase account (for backend services)
- Google Gemini API key (for AI features)

### Setup

```bash
git clone https://github.com/chrisssp/stayhard-mobile-app.git
cd stayhard-mobile-app
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Development

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo 53 + React Native 0.79 |
| Language | TypeScript 5 |
| Styling | NativeWind (Tailwind CSS 3) |
| Navigation | Expo Router + React Navigation |
| Backend | Supabase (Auth, PostgreSQL, Realtime) |
| AI | Google Gemini AI |
| Animations | React Native Reanimated |
| Icons | react-native-heroicons |

## Project Structure

```
stayhard-mobile-app/
├── app/              # Expo Router pages
├── components/       # Reusable UI components
├── services/         # API clients (Supabase, Gemini)
├── config/           # App configuration
├── assets/           # Images, fonts, icons
└── README.md
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and PR workflow.

## License

This project is licensed under the GPL v3 — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

**Authors:**

- [@chrisssp](https://github.com/chrisssp) — Christian Serrano
