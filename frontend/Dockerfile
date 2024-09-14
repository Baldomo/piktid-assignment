FROM node:20-alpine AS build
WORKDIR /build/frontend

# install only dependency to leverage on the cache
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci

# build the software. This make sure dependencies are reused between builds!
COPY . /build/frontend
RUN npm test && npm run build

FROM nginx
EXPOSE 80
# The nginx template system is abused to output the configuration file into /etc/nginx/nginx.conf
# instead of /etc/nginx/conf.d. This way the file is used as the main configuration
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY --from=build /build/frontend/dist /www
