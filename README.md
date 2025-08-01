# Harbour

A personal bookmarking tool designed for seamless saving and accessing of web links across all your devices.

## Overview

Harbour is built as a monorepo containing:
- **Backend API**: Go-based REST API hosted on Deta Space
- **Mobile App**: React Native app for quick link saving (Android/iPad)
- **Web Interface**: React web app for managing bookmarks

## Architecture

The project follows a cost-effective, developer-friendly approach:
- Free-tier services (Deta Space, Vercel/Netlify)
- Single repository for all components
- Shared code between web and mobile using react-native-web
- Simple CI/CD pipeline with GitHub Actions

## Repository Structure

```
/harbour
├── backend/          # Go API server
├── mobile/           # React Native app
├── web/             # React web app
└── shared/          # Shared code and types
```

## Quick Start

This project is currently in the planning phase. Development commands will be available once implementation begins.

## Deployment

- **Backend**: Automatic deployment to Deta Space via GitHub Actions
- **Web**: Static hosting with automatic deployment from main branch
- **Mobile**: Manual sideloading to personal devices

## Core Features

- One-tap bookmark saving from any app/browser
- Clean web interface for bookmark management
- Cross-device synchronization
- Lightweight and fast performance

## Development Status

🚧 **In Planning Phase** - See `project_plan.md` for detailed specifications.