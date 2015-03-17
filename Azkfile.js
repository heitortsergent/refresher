/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  refresher: {
    // Dependent systems
    depends: ["redis"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/ruby:2.2"},
    // Steps to execute before running instances
    provision: [
      "bundle install --path /azk/bundler",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "bundle exec sidekiq -c 20 -q feed_refresher_fetcher_critical,2 -q feed_refresher_fetcher -r ./app/boot.rb",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': path("."),
      '/azk/bundler': persistent("bundler"),
    },
    scalable: {"default": 1},
    http: null,
    envs: {
      // set instances variables
      RUBY_ENV: "development",
      BUNDLE_APP_CONFIG: "/azk/bundler",
    },
  },
  redis: {
    image: {"docker": "redis"},
    export_envs: {
      "REDIS_HOST": "#{net.host}",
      "REDIS_PORT": "#{net.port.data}",
      "REDIS_URL": "redis://#{net.host}:#{net.port[6379]}",
    },
  },
});



