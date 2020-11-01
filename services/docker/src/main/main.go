package main

import (
	"fmt"
	"kalekber/dream/services/docker/src/routes"
	"log"
	"net/http"
)

func main() {
	r := routes.InitRoutes()
	// using the function

	fmt.Println("Running web server on port 8080")

	log.Fatal(http.ListenAndServe(":8080", r))
}
