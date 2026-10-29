FROM node:20-alpine
WORKDIR /app
COPY package.json stdio.mjs server.mjs content.mjs sdk-status.mjs data.json ./
ENV NODE_ENV=production
ENTRYPOINT ["node","stdio.mjs"]
