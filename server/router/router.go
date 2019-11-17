package router

import (
	"survey-app/server/middleware"
	"github.com/gorilla/mux"
	"net/http"
)

// Router is exported and used in main.go
func Router() *mux.Router {
	router := mux.NewRouter()
	

	http.HandleFunc("/survey/{id}", func(w http.ResponseWriter, r *http.Request){
		http.ServeFile(w, r, "/client/build/index.html");
	});
	router.HandleFunc("/api/survey", middleware.GetAllSurveys).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/survey/{id}", middleware.GetSurvey).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/survey", middleware.CreateSurvey).Methods("POST", "OPTIONS")		
	router.HandleFunc("/api/survey/{id}/vote", middleware.VoteSurvey).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/survey/{id}/results", middleware.GetSurvey).Methods("GET", "OPTIONS")
	
	return router
}
