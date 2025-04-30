# Imagen base de Node.js
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /var/www/url-stats

RUN apk add --no-cache libc6-compat

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto de NestJS
EXPOSE 3000

# Comando para iniciar NestJS
CMD ["npm", "run", "start:dev"]