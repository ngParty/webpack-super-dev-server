Webpack Super Dev Server
==========================

Webpack server with Mock and Proxy support

```
Usage:
webpack-super-dev-server [options]

Options:
  --config, -c   Webpack config file     [string] [default: "webpack.config.js"]
  --contentBase  Directory base                        [string] [default: "app"]
  --host, -h     Dev server host ip              [string] [default: "localhost"]
  --port, -p     Dev server port                      [string] [default: "9000"]
  --proxy        Proxy server target                                    [string]
  --proxyPath    Proxy server route match                               [string]
  --mockConfig   Path to mock json config file                           [array]
  --help, -h     Show help                                              [string]

Examples:
  webpack-super-dev-server -p 9000 -h       Will start server on 0.0.0.0:3000
  0.0.0.0 --proxy http://localhost:3000     and will proxy /api requests to
  --proxyPath /api/* --mockConfig             http://localhost:3000 and repond
  mockConfig1.json --mockConfig             with mockConfig1.json and
  mockConfig2.json                          mockConfig2.json mocks
  ```
