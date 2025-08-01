package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

var db base.Base

func main() {
	// Initialize Deta
	projectKey := os.Getenv("DETA_PROJECT_KEY")
	if projectKey == "" {
		log.Fatal("DETA_PROJECT_KEY environment variable is required")
	}

	d, err := deta.New(deta.WithProjectKey(projectKey))
	if err != nil {
		log.Fatal("Failed to initialize Deta:", err)
	}

	db, err = base.New(d, "bookmarks")
	if err != nil {
		log.Fatal("Failed to initialize Deta Base:", err)
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

	key, err := db.Put(bookmark)
	if err != nil {
		log.Printf("Failed to save bookmark: %v", err)
		http.Error(w, "Failed to save bookmark", http.StatusInternalServerError)
		return
	}

	log.Printf("Saved bookmark with key: %s, URL: %s", key, req.URL)

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