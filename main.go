package main

import (
	"fmt"
	"log"
	"net/http"

	"survey-app/router"
)

func main() {
	r := router.Router()
	// fs := http.FileServer(http.Dir("build"))
	// http.Handle("/", fs)
	fmt.Println("Starting server on the port 3001...")

	log.Fatal(http.ListenAndServe(":8080", r))
}
