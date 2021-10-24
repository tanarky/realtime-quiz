FROM ruby:2.7.2
ENV LANG=C.UTF-8 \
    APP_HOME=/app
ENV BUNDLE_GEMFILE=$APP_HOME/Gemfile \
    BUNDLE_JOBS=2 \
    BUNDLE_PATH=/usr/local/bundle \
    DOCKER=1

# COPY Gemfile Gemfile.lock $APP_HOME/

RUN mkdir -p $APP_HOME && \
    apt-get update -qq && \
    apt-get install -y \
        nginx \
        vim \
        wget && \
    gem install bundler && \
    apt-get clean && \
    rm -f /var/lib/apt/lists/*_*

WORKDIR $APP_HOME

ADD . $APP_HOME
RUN mkdir -p -m 0777 tmp/cache tmp/cache/assets tmp/pids tmp/sockets tmp/storage

ADD config/nginx.conf /etc/nginx/conf.d/default.conf
