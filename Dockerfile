# Utiliser une image Node.js officielle avec une version LTS
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste des fichiers du projet
COPY . .

# S'assurer que les permissions sont correctes
RUN chown -R node:node /app
USER node

# Exposer le port 2000
EXPOSE 2000

# Définir la commande de démarrage en utilisant node directement
CMD ["node", "src/entrypoint.js"]
# Instructions de construction et d'exécution :
# Pour construire l'image :
# docker build -t radio-api-nodejs .
#
# Pour exécuter le conteneur :
# docker run -p 2000:2000 radio-api-nodejs