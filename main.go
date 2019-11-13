package main

import (	
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
	//r := router.Router()	
	fs := http.FileServer(http.Dir("build"))
	http.Handle("/", fs)
	// port := getPort()
	// log.Fatal(http.ListenAndServe(port, r))	
}
