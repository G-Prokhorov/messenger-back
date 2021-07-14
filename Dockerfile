FROM ser

WORKDIR /usr/src/app

RUN rm -rf /usr/src/app/node_modules /usr/src/app/package-lock.json

COPY package*.json ./

# Bundle app source
COPY . /usr/src/app

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]

FROM ws

WORKDIR /usr/src/app

RUN rm -rf /usr/src/app/node_modules /usr/src/app/package-lock.json

COPY package*.json ./

# Bundle app source
COPY . /usr/src/app

RUN npm install

EXPOSE 8085
CMD [ "npm", "start" ]


FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf