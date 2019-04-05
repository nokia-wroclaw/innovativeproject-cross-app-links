FROM node:latest
WORKDIR /app
ADD . /app
RUN npm install
RUN ./node_modules/bower/bin/bower install --allow-root

FROM python:3.7
ENV http_proxy 10.158.100.120:8080
ENV https_proxy 10.158.100.120:8080
WORKDIR /app
COPY --from=0 /app .
RUN pip install -r requirements.txt
CMD flask run --host=0.0.0.0
