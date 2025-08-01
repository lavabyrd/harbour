### Project Specification: Harbour

#### 1\. Project Goal

The primary goal of "Harbour" is to create a personal, seamless, and efficient bookmarking tool that allows you to save and access web links from any device. The tool will function outside of traditional app stores, leveraging a mobile app for on-the-go saving and a web interface for management, all synchronized through a central backend.

#### 2\. Project Name

**Harbour**

#### 3\. Core Principles

  * **Monorepo:** The entire codebase (backend API, mobile app, and web interface) will be housed in a single GitHub repository. This approach simplifies development, ensures a single source of truth, and streamlines the CI/CD pipeline.
  * **Cost-Effective:** The project will be built almost entirely on free-tier services.
  * **Developer-Friendly:** The chosen technologies (Go, React Native, GitHub Actions) are modern, well-documented, and designed for a smooth development experience.
  * **User Experience:** The primary focus is on a low-friction "save" action from mobile devices and a simple, clean interface for accessing and managing saved links from any browser.

#### 4\. High-Level Architecture

The architecture is split into three main components, all residing within a single monorepo:

  * **Backend API:** A RESTful API built with Go and hosted on **Deta Space**. This service will handle all logic for saving and retrieving bookmarks. It will use **Deta Base** as its free, built-in datastore.
  * **Mobile App:** A cross-platform app built with React Native that will be sideloaded onto your personal Android and iPad devices. Its primary function is to act as a "Share" target, allowing you to quickly save links from any browser or app.
  * **Web Interface (MacBook):** A web-based client built with React. This will be a standard website that you access from a browser. We will use a separate, free static site host like **Vercel** or **Netlify** for this component. The core components will be shared with the mobile app codebase using `react-native-web`.

#### 5\. Repository Structure

The monorepo will follow a logical, component-based directory structure:

```
/harbour-monorepo
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline for the entire project
│
├── backend/                  # The Go API for Deta Space
│   ├── main.go             # Main application file
│   ├── go.mod              # Go dependencies
│   ├── Spacefile           # Deta Space configuration file
│   └── ...                 # Other Go API files
│
├── mobile/                   # The React Native app (Android & iOS)
│   ├── android/            # Native Android files
│   ├── ios/                # Native iOS files
│   ├── src/                # Shared React Native code
│   └── package.json        # Node.js dependencies
│
├── web/                      # The React web app
│   ├── public/             # Static files
│   ├── src/                # Web-specific React code
│   └── package.json
│
└── shared/                   # (Optional) For shared code, like data models
    ├── types.go            # Go structs for API data models
    └── types.ts            # TypeScript types for the frontends
```

#### 6\. Technology Stack

  * **Backend:**
      * **Language:** Go
      * **Hosting:** Deta Space
      * **Database:** Deta Base
  * **Frontend (Mobile):**
      * **Framework:** React Native (sideloaded)
      * **Native Integration:** Platform-specific code (Swift/Kotlin) for the "Share" menu functionality, minimized via community libraries.
  * **Frontend (Web):**
      * **Framework:** React with `react-native-web`
      * **Hosting:** A static site host like Vercel or Netlify.
  * **CI/CD:**
      * **Tool:** GitHub Actions
      * **Workflow:**
          * A push to the `develop` branch automatically deploys the `backend/` code to a staging Deta Space project.
          * A push to the `main` branch automatically deploys the `backend/` code to a production Deta Space project.
          * The web app will be deployed automatically by its hosting provider from a `push` to `main`.

#### 7\. Backend API Specification

  * **Endpoint:** `/api/bookmarks`
      * **Method:** `POST`
      * **Payload:** A JSON object containing the bookmark data.
      * **Request Body:**
        ```json
        {
          "url": "https://example.com/some-page",
          "title": "Example Page Title"
        }
        ```
      * **Response:** A JSON object confirming the bookmark was saved.
        ```json
        {
          "message": "Bookmark saved successfully!"
        }
        ```

#### 8\. Sideloading & Usage Plan

  * **Android:** An `.apk` file will be manually installed after enabling "Install from unknown sources" in device settings.
  * **iPad:** The app will be deployed directly from Xcode to your personal device.
  * **MacBook:** You will access the web app from any browser by navigating to the provided URL from your static site host.

This revised specification provides a clear and detailed plan for building Harbour, with a strong focus on using free services and a clean monorepo architecture.