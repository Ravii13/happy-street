# Multi-stage build that builds backend, frontend, and admin,
# then runs backend (Node) and serves frontend/admin static files with nginx

FROM node:18-alpine AS builder
WORKDIR /build

# Copy everything and build each part in-place
COPY . .

# Install backend production deps
RUN cd backend && npm ci --omit=dev

# Build frontend (Vite)
RUN cd frontend && npm ci && npm run build

# Build admin (Vite)
RUN cd admin && npm ci && npm run build

FROM node:18-alpine

# Install nginx
RUN apk add --no-cache nginx

# Create app directory
WORKDIR /app

# Copy backend runtime files and its node_modules from builder
COPY --from=builder /build/backend /app/backend
COPY --from=builder /build/backend/node_modules /app/backend/node_modules

# Copy static builds into nginx html folder
RUN mkdir -p /usr/share/nginx/html/frontend /usr/share/nginx/html/admin
COPY --from=builder /build/frontend/dist /usr/share/nginx/html/frontend
COPY --from=builder /build/admin/dist /usr/share/nginx/html/admin
# Also copy builds into /app so the Node backend can serve them if nginx isn't used
RUN mkdir -p /app/frontend/dist /app/admin/dist
COPY --from=builder /build/frontend/dist /app/frontend/dist
COPY --from=builder /build/admin/dist /app/admin/dist

# Copy nginx config and start script
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["/start.sh"]
