require 'sinatra/base'
require 'sinatra/json'
require 'faye/websocket'
require 'thread'
require 'redis'
require 'json'
require 'erb'
#require './middlewares/quiz_data'

module Quiz
  class Backend
    KEEPALIVE_TIME = 10 # in seconds
    CHANNEL        = "quiz"

    def initialize(app)
      @app     = app
      @clients = []
      #uri = URI.parse(ENV["REDISCLOUD_URL"])
      uri = URI.parse(ENV["REDIS_URL"])
      @redis = Redis.new(host: uri.host, port: uri.port, password: uri.password)

      Thread.new do
        redis_sub = Redis.new(host: uri.host, port: uri.port, password: uri.password)
        redis_sub.subscribe(CHANNEL) do |on|
          on.message do |channel, msg|
            @clients.each {|ws| ws.send(msg) }
          end
        end
      end
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })
        ws.on :open do |event|
          p [:open, ws.object_id]
          @clients << ws
        end

        ws.on :message do |event|
          p [:message, event.data]
          data = sanitize(event.data)
          if data[:handle] == 'admin'
            p "yes, admin3"
            @redis.publish(CHANNEL, JSON.generate(data))
          else
            p data[:handle]
            p "not admin desux"
          end
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code, event.reason]
          @clients.delete(ws)
          ws = nil
        end

        # Return async Rack response
        ws.rack_response

      else
        @app.call(env)
      end
    end

    private
    def sanitize(message)
      json = JSON.parse(message, symbolize_names: true)
      data = {}
      json.each {|key, value| data[key] = ERB::Util.html_escape(value) }
      data
    end
  end

  class App < Sinatra::Base
    #require './middlewares/quiz_backend'
    use Quiz::Backend

    configure :development do
      require 'sinatra/reloader'
      register Sinatra::Reloader
    end

    not_found do
      status 404
      json({ error: "Not found" })
    end

    error 400 do
      status 400
      json({ error: "Bad Request" })
    end

    get "/" do
      erb :"index.html"
    end

    get "/admin" do
      p 'hello4'
      erb :"admin.html"
    end
  end
end
