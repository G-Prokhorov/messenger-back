FROM node:14

COPY . /src

WORKDIR /src

RUN npm install
RUN npm run build

EXPOSE 5050
CMD [ "npm", "start" ]