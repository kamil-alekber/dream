FROM node:12-alpine

EXPOSE 3000

WORKDIR /usr/src/app

COPY entry entry

# RUN yarn install --frozen-lockfile
# RUN yarn install --production --frozen-lockfile

CMD ["node", "entry/index.js"] 

