package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/deta/deta-go/deta"
	"github.com/deta/deta-go/service/base"
)

type Bookmark struct {
	Key       string    `json:"key,omitempty"`
	URL       string    `json:"url"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
}

type BookmarkRequest struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

type Response struct {
	Message string `json:"message"`
}

var db *base.Base
var localStore map[string]Bookmark
var storeMutex sync.RWMutex
var useLocalStore bool

func main() {
	// Check if we should use local storage for development
	projectKey := os.Getenv("DETA_PROJECT_KEY")
	if projectKey == "" {
		log.Println("No DETA_PROJECT_KEY found, using local in-memory storage for development")
		useLocalStore = true
		localStore = make(map[string]Bookmark)
	} else {
		// Initialize Deta for production
		d, err := deta.New(deta.WithProjectKey(projectKey))
		if err != nil {
			log.Fatal("Failed to initialize Deta:", err)
		}

		db, err = base.New(d, "bookmarks")
		if err != nil {
			log.Fatal("Failed to initialize Deta Base:", err)
		}
		log.Println("Using Deta Base for storage")
	}

	// Set up routes
	http.HandleFunc("/api/bookmarks", corsMiddleware(bookmarksHandler))
	http.HandleFunc("/health", healthHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func bookmarksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req BookmarkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.URL == "" {
		http.Error(w, "URL is required", http.StatusBadRequest)
		return
	}

	if req.Title == "" {
		req.Title = req.URL
	}

	bookmark := Bookmark{
		URL:       req.URL,
		Title:     req.Title,
		CreatedAt: time.Now(),
	}

	var key string
	var err error

	if useLocalStore {
		// Generate a simple key for local storage
		key = fmt.Sprintf("bookmark_%d", time.Now().UnixNano())
		bookmark.Key = key
		
		storeMutex.Lock()
		localStore[key] = bookmark
		storeMutex.Unlock()
		
		log.Printf("Saved bookmark locally with key: %s, URL: %s", key, req.URL)
	} else {
		// Use Deta Base
		key, err = db.Put(bookmark)
		if err != nil {
			log.Printf("Failed to save bookmark: %v", err)
			http.Error(w, "Failed to save bookmark", http.StatusInternalServerError)
			return
		}
		log.Printf("Saved bookmark to Deta with key: %s, URL: %s", key, req.URL)
	}

	response := Response{
		Message: "Bookmark saved successfully!",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}