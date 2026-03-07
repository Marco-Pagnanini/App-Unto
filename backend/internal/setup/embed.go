package setup

import _ "embed"

//go:embed assets/docker-compose.yml
var dockerComposeTemplate []byte
