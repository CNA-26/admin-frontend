# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# OpenShift runs containers as random UID
RUN chmod -R g+rwX /var/cache/nginx \
    && chmod -R g+rwX /var/run \
    && chmod -R g+rwX /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
