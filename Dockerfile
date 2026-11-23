# ----------------------------------------------------
# Etapa 1: Dependencias base
# ----------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ----------------------------------------------------
# Etapa 2: Desarrollo con Hot-Reload (Vite Server)
# ----------------------------------------------------
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ----------------------------------------------------
# Etapa 3: Compilación para producción
# ----------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ----------------------------------------------------
# Etapa 4: Servidor web de producción (Nginx Alpine)
# ----------------------------------------------------
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
