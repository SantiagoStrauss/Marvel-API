# Define la imagen base
FROM node:14

# Establece el directorio de trabajo
WORKDIR /marvelApp

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]