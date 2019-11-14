package handlers
import (
    "net/http"
    "io"    
)


func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
    // A very simple health check.
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")

    io.WriteString(w, `{"alive": true}`)
}