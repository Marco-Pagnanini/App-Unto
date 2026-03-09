#!/bin/bash
echo "Shutting down App-Unto..."
pkill -f "./notes-server"
echo "✅ Server shut down successfully."