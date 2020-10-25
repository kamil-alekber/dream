package main

import (
	"fmt"
	"kalekber/dream/services/docker/src/controller"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/register", controller.RegisterHandler).
		Methods("POST")
	r.HandleFunc("/login", controller.LoginHandler).
		Methods("POST")
	r.HandleFunc("/profile", controller.ProfileHandler).
		Methods("GET")

	fmt.Println("Running web server on port 8080")

	log.Fatal(http.ListenAndServe(":8080", r))
}
