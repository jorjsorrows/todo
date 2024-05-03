package main

import (
	"fmt"
	"log"
	"net/http"
	"to-do/server/router"
)

func main() {
	r := router.Router()
	fmt.Println("Starting The Server On Port 7000...")

	log.Fatal(http.ListenAndServe(":7000", r))
}
