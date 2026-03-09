#!/bin/bash

# Colori per rendere il terminale più carino
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting App-Unto ===${NC}"

# 1. Controlla se l'app è stata compilata, altrimenti la compila
if [ ! -f "./notes-server" ]; then
    echo "Compiling server..."
    go build -o notes-server .
fi

# 2. Controlla se manca il file .env (Primo Avvio)
if [ ! -f ".env" ]; then
    echo -e "${GREEN}First startup detected! Starting config procedure...${NC}"
    # Lancia il server in primo piano (eseguirà lo wizard e si chiuderà grazie a os.Exit)
    ./notes-server
    
    # Se lo wizard fallisce o viene interrotto, ferma lo script
    if [ $? -ne 0 ]; then
        echo "Configuration interrupted."
        exit 1
    fi
fi

# 3. Ora che il .env esiste, avvia il server in background
echo "Starting server in background..."

# pkill assicura che non ci siano vecchie versioni del server già aperte bloccate
pkill -f "./notes-server" 2>/dev/null

# Lancia in background usando nohup
nohup ./notes-server > server.log 2>&1 &

echo -e "${GREEN}✅ App-Unto is online!${NC}"
echo "You can close this window. Logs will be saved in 'server.log'."
echo "To stop the server use: ./stop.sh"