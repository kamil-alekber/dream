FROM node:12-alpine

EXPOSE 3000

WORKDIR /usr/src/app

COPY files files

# RUN yarn install --frozen-lockfile
# RUN yarn install --production --frozen-lockfile

CMD ["node", "files/index.js"] 

