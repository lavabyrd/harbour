# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harbour is a personal bookmarking tool built as a monorepo with three main components:
- **Backend API**: Go-based REST API hosted on Deta Space using Deta Base
- **Mobile App**: React Native app for Android/iPad (sideloaded)
- **Web Interface**: React web app with react-native-web for shared components

## Repository Structure

The project follows a monorepo structure with these main directories:
- `backend/` - Go API server with Deta Space configuration (Spacefile)
- `mobile/` - React Native app with platform-specific native code
- `web/` - React web application 
- `shared/` - Shared code including Go structs and TypeScript types

## Development Commands

**Note**: This repository is currently in planning phase. The following commands will be available once implementation begins:

### Backend (Go)
```bash
cd backend
go run main.go          # Run development server
go test ./...           # Run tests
go build               # Build binary
```

### Mobile (React Native)
```bash
cd mobile
npm install            # Install dependencies
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS
```

### Web (React)
```bash
cd web
npm install            # Install dependencies
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
```

## Architecture Notes

### API Design
- Single endpoint: `POST /api/bookmarks`
- Request format: `{"url": "...", "title": "..."}`
- Response format: `{"message": "Bookmark saved successfully!"}`

### Deployment Strategy
- **Backend**: Deta Space with automatic deployment via GitHub Actions
- **Web**: Static hosting (Vercel/Netlify) with automatic deployment
- **Mobile**: Manual sideloading (.apk for Android, Xcode for iPad)

### Shared Components
The web and mobile apps share components via `react-native-web`, allowing code reuse between platforms while maintaining platform-specific optimizations.

### CI/CD Pipeline
- `develop` branch → staging Deta Space deployment
- `main` branch → production Deta Space deployment  
- Web app deploys automatically from `main` branch

## Technology Stack
- **Backend**: Go, Deta Space, Deta Base
- **Mobile**: React Native with minimal native Swift/Kotlin
- **Web**: React with react-native-web
- **CI/CD**: GitHub Actions

## Git Configuration
- GitHub username: lavabyrd
- Committer email: mark@lavabyrd.space
- Repository: https://github.com/lavabyrd/harbour
- Uses SSH for git operations

## Git Workflow
- Use develop branches, so feature branch, merges to develop, merges to main