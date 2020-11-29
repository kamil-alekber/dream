FROM node:12-alpine

EXPOSE 3000

WORKDIR /usr/src/app

COPY entry entry
COPY users users
# RUN yarn install --frozen-lockfile
# RUN yarn install --production --frozen-lockfile
COPY run.sh .
RUN chmod +x run.sh

CMD ["sh", "run.sh"] 