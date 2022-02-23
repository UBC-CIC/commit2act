FROM node:14.15.4-alpine
COPY [".", "/usr/src/"]
WORKDIR /usr/src/
ENV NODE_ENV=development

RUN npm config set unsafe-perm true
RUN npm install --ignore-scripts=false --verbose sharp
RUN npm run build
CMD [ "npm", "run", "develop" ]
EXPOSE 1337
