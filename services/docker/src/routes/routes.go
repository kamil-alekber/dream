package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	natting "github.com/docker/go-connections/nat"
	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", GetUser).Methods("GET")
	router.HandleFunc("/containers", ContainerList).Methods("GET")
	router.HandleFunc("/containers/run", RunContainer).Methods("GET")
	router.HandleFunc("/upload", uploadHandler)

	return router
}

type User struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	var user User
	user.Age = 24
	user.Name = "Kamil"

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(map[string]User{"author": user}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	return

}

func RunContainer(w http.ResponseWriter, r *http.Request) {
	cli, err := client.NewEnvClient()
	if err != nil {
		panic(err)
	}
	runContainer(cli, "web/v1", "web2", "3000", []string{"env:env123"})
	return
}

func ContainerList(w http.ResponseWriter, r *http.Request) {
	cli, err := client.NewEnvClient()
	if err != nil {
		panic(err)
	}
	var opts types.ContainerListOptions

	containers, err := cli.ContainerList(context.Background(), opts)
	if err != nil {
		panic(err)
	}

	for _, container := range containers {
		fmt.Printf("%s %s\n", container.ID[:10], container.Image)
	}

	if err := json.NewEncoder(w).Encode(containers); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

func runContainer(client *client.Client, imagename string, containername string, port string, inputEnv []string) error {
	// Define a PORT opening
	newport, err := natting.NewPort("tcp", port)
	if err != nil {
		fmt.Println("Unable to create docker port")
		return err
	}

	// Configured hostConfig:
	// https://godoc.org/github.com/docker/docker/api/types/container#HostConfig
	hostConfig := &container.HostConfig{
		AutoRemove: true,
		PortBindings: natting.PortMap{
			newport: []natting.PortBinding{
				{
					HostIP:   "0.0.0.0",
					HostPort: port,
				},
			},
		},
		// RestartPolicy: container.RestartPolicy{
		// 	Name: "always",
		// },
		LogConfig: container.LogConfig{
			Type:   "json-file",
			Config: map[string]string{},
		},
	}

	// Define Network config (why isn't PORT in here...?:
	// https://godoc.org/github.com/docker/docker/api/types/network#NetworkingConfig
	networkConfig := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{},
	}
	gatewayConfig := &network.EndpointSettings{
		Gateway: "gatewayname",
	}
	networkConfig.EndpointsConfig["bridge"] = gatewayConfig

	// Define ports to be exposed (has to be same as hostconfig.portbindings.newport)
	exposedPorts := map[natting.Port]struct{}{
		newport: struct{}{},
	}

	// Configuration
	// https://godoc.org/github.com/docker/docker/api/types/container#Config
	config := &container.Config{
		Image:        imagename,
		Env:          inputEnv,
		ExposedPorts: exposedPorts,
		Hostname:     fmt.Sprintf("%s-hostnameexample", imagename),
	}

	// Creating the actual container. This is "nil,nil,nil" in every example.
	cont, err := client.ContainerCreate(
		context.Background(),
		config,
		hostConfig,
		networkConfig,
		containername,
	)

	if err != nil {
		log.Println(err)
		return err
	}

	// Run the actual container
	client.ContainerStart(context.Background(), cont.ID, types.ContainerStartOptions{})
	log.Printf("Container %s is created", cont.ID)

	return nil
}

// Compile templates on start of the application
var templates = template.Must(template.ParseFiles("src/public/upload.html"))

// Display the named template
func display(w http.ResponseWriter, page string, data interface{}) {
	templates.ExecuteTemplate(w, page+".html", data)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		display(w, "upload", nil)
	case "POST":
		uploadFile(w, r)
	}
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 10 MB files
	r.ParseMultipartForm(10 << 20)

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	dst, err := os.Create(handler.Filename)
	defer dst.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Successfully Uploaded File\n")
}
