FROM node:18

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todos los archivos al contenedor
COPY . .

# Establecer el puerto que la aplicación utilizará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
