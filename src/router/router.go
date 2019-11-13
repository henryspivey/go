package router

import (
	"src/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/survey", src.middleware.GetAllSurveys).Methods("GET")
	router.HandleFunc("/api/survey/{id}", src.middleware.GetSurvey).Methods("GET")
	router.HandleFunc("/api/survey", src.middleware.CreateSurvey).Methods("POST")		
	router.HandleFunc("/api/survey/{id}/vote", src.middleware.VoteSurvey).Methods("POST")
	router.HandleFunc("/api/survey/{id}/results", src.middleware.GetSurvey).Methods("GET")
	
	return router
}
