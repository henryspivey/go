package main

import (	
	"log"
	"os"
	"net/http"

	"survey-app/server/router"
)

func getPort() string {
  p := os.Getenv("PORT")
  if p != "" {
    return ":" + p
  }
  return ":8080"
}

func main() {
	r := router.Router()	
	buildHandler := http.FileServer(http.Dir("client/build/index.html"))
	r.PathPrefix("/").Handler(buildHandler)
	port := getPort()
	  log.Fatal(http.ListenAndServe(port, r))	
}
