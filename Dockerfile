# Imagen base de Node.js
FROM node:18-alpine

ARG UID
ARG GID

# Crear directorio de la app
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto de NestJS
EXPOSE 3000

# Comando para iniciar NestJS
CMD ["npm", "run", "start"]