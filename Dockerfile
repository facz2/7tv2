# base image
FROM mhart/alpine-node:12


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock


#tools
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm -g install node-gyp \
    && yarn install && yarn cache clean \
    && apk del build-dependencies

EXPOSE 3000

#CMD yarn run start

CMD tail -f > /dev/null
