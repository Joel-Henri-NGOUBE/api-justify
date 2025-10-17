FROM node:22.20-alpine

WORKDIR api/

COPY package.json api/

COPY . api/

RUN chmod +x api/package.json

RUN npm install -C api

CMD ["npm", "run", "dev", "-C", "api", "--host", "0.0.0.0", "--port", "3501"]

EXPOSE 3501