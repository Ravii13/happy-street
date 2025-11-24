#!/bin/sh
# Start backend and nginx. Backend runs on port 3000. Nginx runs in foreground.

set -e

# Ensure uploads directory exists
mkdir -p /app/backend/uploads

# Start backend
cd /app/backend
echo "Starting backend..."
node server.js &

# Log whether frontend/admin builds exist for easier debugging
if [ -f /app/frontend/dist/index.html ]; then
	echo "Found frontend build at /app/frontend/dist/index.html"
else
	echo "Frontend build not found at /app/frontend/dist/index.html"
fi

if [ -f /app/admin/dist/index.html ]; then
	echo "Found admin build at /app/admin/dist/index.html"
else
	echo "Admin build not found at /app/admin/dist/index.html"
fi

# Also list what nginx will serve (verify files copied into /usr/share/nginx/html/admin)
echo "Listing /usr/share/nginx/html/admin (nginx path):"
if [ -d /usr/share/nginx/html/admin ]; then
	ls -la /usr/share/nginx/html/admin || true
else
	echo "/usr/share/nginx/html/admin does not exist"
fi

# Start nginx in foreground
echo "Starting nginx..."
nginx -g 'daemon off;'
