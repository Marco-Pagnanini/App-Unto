package setup

import (
	"bufio"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

const EnvFile = ".env"

// IsFirstRun controlla se il wizard deve girare.
// Viene saltato se API_KEY è già configurata (env var → Docker, oppure .env con valore).
func IsFirstRun() bool {
	if os.Getenv("API_KEY") != "" {
		return false
	}
	return !hasAPIKeyInEnvFile()
}

// hasAPIKeyInEnvFile legge il file .env e restituisce true se API_KEY ha un valore non vuoto.
func hasAPIKeyInEnvFile() bool {
	f, err := os.Open(EnvFile)
	if err != nil {
		return false
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "API_KEY=") {
			return strings.TrimPrefix(line, "API_KEY=") != ""
		}
	}
	return false
}

// Run esegue il wizard interattivo, scrive .env e avvia Docker Compose.
func Run() error {
	reader := bufio.NewReader(os.Stdin)

	fmt.Println()
	fmt.Println("┌─────────────────────────────────┐")
	fmt.Println("│   Notes App · First-time Setup  │")
	fmt.Println("└─────────────────────────────────┘")
	fmt.Println()

	// Verifica che Docker sia disponibile prima di fare altro
	if err := exec.Command("docker", "compose", "version").Run(); err != nil {
		fmt.Println("✗ Docker non trovato. Installa Docker Desktop prima di continuare.")
		fmt.Println("  https://www.docker.com/products/docker-desktop")
		return fmt.Errorf("docker not available")
	}

	port := ask(reader, "Porta del server", "8080")

	// API Key
	apiKey, err := generateSecret()
	if err != nil {
		return fmt.Errorf("generating api key: %w", err)
	}
	fmt.Printf("API Key (premi Invio per generarla automaticamente): ")
	custom, _ := reader.ReadString('\n')
	custom = strings.TrimSpace(custom)
	if custom != "" {
		apiKey = custom
	} else {
		fmt.Printf("  → Generata: %s\n", apiKey)
	}

	// Password DB generata automaticamente (l'utente non ha motivo di cambiarla)
	dbPassword, err := generateSecret()
	if err != nil {
		return fmt.Errorf("generating db password: %w", err)
	}

	fmt.Println()

	// Scrive .env
	if err := writeEnv(port, apiKey, dbPassword); err != nil {
		return fmt.Errorf("writing .env: %w", err)
	}
	fmt.Println("✓ File .env creato")

	// Avvia Docker Compose
	fmt.Println("→ Avvio dei container Docker (potrebbe richiedere qualche minuto al primo avvio)...")
	fmt.Println()

	cmd := exec.Command("docker", "compose", "up", "-d", "--build")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("docker compose up: %w", err)
	}

	fmt.Println()
	fmt.Println("✓ Setup completato!")
	fmt.Printf("✓ Server in ascolto su:  http://localhost:%s\n", port)
	fmt.Printf("✓ API Key:               %s\n", apiKey)
	fmt.Println()
	fmt.Println("Conserva l'API Key — ti servirà nell'app per autenticarti.")
	fmt.Println("Puoi trovarla in qualsiasi momento nel file .env")

	return nil
}

func ask(r *bufio.Reader, label, defaultVal string) string {
	fmt.Printf("%s [%s]: ", label, defaultVal)
	val, _ := r.ReadString('\n')
	val = strings.TrimSpace(val)
	if val == "" {
		return defaultVal
	}
	return val
}

func generateSecret() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func writeEnv(port, apiKey, dbPassword string) error {
	content := fmt.Sprintf(`# Notes App - Configurazione
# Generato automaticamente dal wizard di setup.
# Riavvia i container dopo ogni modifica: docker compose up -d

SERVER_PORT=%s
API_KEY=%s

DB_HOST=postgres
DB_PORT=5432
DB_USER=notes
DB_PASSWORD=%s
DB_NAME=notes_db
DB_SSLMODE=disable

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
`, port, apiKey, dbPassword)

	return os.WriteFile(EnvFile, []byte(content), 0600)
}
