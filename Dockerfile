#New changes
FROM node:20.15.1-alpine3.20 AS vm-frontend

ARG REACT_APP_BACKEND_URL 
ARG REACT_APP_FRONTEND_URL 
ARG REACT_APP_HEIMDALL_BASELINING_URL
ARG REACT_APP_HEIMDALL_URL
ARG REACT_APP_PSY_URL
ARG REACT_APP_DYTE_ORGID
ARG REACT_APP_DYTE_APIKEY
ARG REACT_APP_COGNITION_API_KEY_LABEL
ARG REACT_APP_COGNITION_URL
ARG REACT_APP_CHALLENGE_URL
ARG REACT_APP_CHALLENGE_TRAIT_URL
ARG REACT_APP_COGNITION_API_KEY
ARG REACT_APP_NEW_HEIMDALL_BASELINING_URL
ARG REACT_APP_DS_CLIENT_ID
ARG REACT_APP_DS_CLIENT_SECRET
ARG REACT_APP_DS_CLIENT_ID
ARG REACT_APP_DS_CLIENT_SECRET
ARG REACT_APP_HEIMDALL_BASE_URL
ARG REACT_APP_SHARE_REPORT_URL

ENV NODE_OPTIONS=--max-old-space-size=8192
ENV GENERATE_SOURCEMAP=false
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL
ENV REACT_APP_FRONTEND_URL $REACT_APP_FRONTEND_URL
ENV REACT_APP_HEIMDALL_BASELINING_URL $REACT_APP_HEIMDALL_BASELINING_URL
ENV REACT_APP_HEIMDALL_URL $REACT_APP_HEIMDALL_URL
ENV REACT_APP_PSY_URL $REACT_APP_PSY_URL
ENV REACT_APP_DYTE_ORGID $REACT_APP_DYTE_ORGID
ENV REACT_APP_DYTE_APIKEY $REACT_APP_DYTE_APIKEY
ENV REACT_APP_COGNITION_API_KEY_LABEL $REACT_APP_COGNITION_API_KEY_LABEL
ENV REACT_APP_COGNITION_URL $REACT_APP_COGNITION_URL
ENV REACT_APP_CHALLENGE_URL $REACT_APP_CHALLENGE_URL
ENV REACT_APP_CHALLENGE_TRAIT_URL $REACT_APP_CHALLENGE_TRAIT_URL
ENV REACT_APP_COGNITION_API_KEY $REACT_APP_COGNITION_API_KEY
ENV REACT_APP_NEW_HEIMDALL_BASELINING_URL $REACT_APP_NEW_HEIMDALL_BASELINING_URL
ENV REACT_APP_DS_CLIENT_ID $REACT_APP_DS_CLIENT_ID
ENV REACT_APP_DS_CLIENT_SECRET $REACT_APP_DS_CLIENT_SECRET
ENV REACT_APP_DS_CLIENT_ID $REACT_APP_DS_CLIENT_ID
ENV REACT_APP_DS_CLIENT_SECRET $REACT_APP_DS_CLIENT_SECRET
ENV REACT_APP_HEIMDALL_BASE_URL $REACT_APP_HEIMDALL_BASE_URL
ENV REACT_APP_SHARE_REPORT_URL $REACT_APP_SHARE_REPORT_URL

RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install --legacy-peer-deps
COPY . .

RUN node --version && npm --version && printenv && ls -la /usr/src/app
RUN npm run build --verbose

FROM nginx:stable-alpine

#copy the dist file 
#COPY --from=vm-frontend /usr/src/app/dist /usr/share/nginx/html
COPY --from=vm-frontend /usr/src/app/build /usr/share/nginx/html

RUN addgroup --gid 3001 value-system
RUN adduser -D -H -u 3002 -S value-user -G value-system -s /bin/false -g "nginx user"
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf \
    && sed -i 's,listen       80;,listen       9200;,' /etc/nginx/conf.d/default.conf \
    && sed -i '/index  index.html index.htm;/a try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf \
    && sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf \
    && chown -R value-user:value-system /var/cache/nginx /var/log/nginx \
    && chmod -R g+w /var/cache/nginx \
    && chmod -R g+w /var/log/nginx \
    && chown -R value-user:value-system /etc/nginx \
    && chown -R value-user:value-system /usr/share/nginx/html \
    && chmod -R g+w /etc/nginx

EXPOSE 9200
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
