package router

import (
	"survey-app/server/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/survey", middleware.GetAllSurveys).Methods("GET")
	router.HandleFunc("/api/survey/{id}", middleware.GetSurvey).Methods("GET")
	router.HandleFunc("/api/survey", middleware.CreateSurvey).Methods("POST")		
	router.HandleFunc("/api/survey/{id}/vote", middleware.VoteSurvey).Methods("POST")
	router.HandleFunc("/api/survey/{id}/results", middleware.GetSurvey).Methods("GET")
	
	return router
}