#!/bin/sh
# Start backend and nginx. Backend runs on port 3000. Nginx runs in foreground.

set -e

# Ensure uploads directory exists
mkdir -p /app/backend/uploads

# Start backend
cd /app/backend
echo "Starting backend..."
node server.js &

# Start nginx in foreground
echo "Starting nginx..."
nginx -g 'daemon off;'
