package main

import (
	"fmt"
	"log"
	"net/http"

	"survey-app/server/router"
)

func getPort() string {
  p := os.Getenv("PORT")
  if p != "" {
    return ":" + p
  }
  return ":3000"
}

func main() {
	r := router.Router()
	// fs := http.FileServer(http.Dir("build"))
	// http.Handle("/", fs)
	fmt.Println("Starting server on the port 3001...")
	port := getPort()
	  log.Fatal(http.ListenAndServe(port, r))	
}
