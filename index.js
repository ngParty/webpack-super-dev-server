const cwd = process.cwd();
const fs = require( 'fs' );
const path = require( 'path' );
const argv = require( 'yargs' );

// @TODO remove lodash dependecy
const _ = require( 'lodash' );

const WebpackDevServer = require( 'webpack-dev-server' );
const webpack = require( 'webpack' );

/**
 * Webpack super server
 */
function SuperServer( options ) {

  const configFilePath = ( options.config || 'webpack.config.js' )
  const webpackConfig = require( cwd + '/' + configFilePath );

  const compiler = webpack( webpackConfig );

  const proxySetup = {};


  if ( options.proxy ) {

    console.log( 'Proxying from ' + options.proxyPath + ' to ' + options.proxy );
    proxySetup[ options.proxyPath ] = options.proxy;

  }

  const contentBase = ( options.contentBase || 'app' );

  var server = new WebpackDevServer( compiler, Object.assign( webpackConfig.devServer, {
    contentBase: contentBase,
    proxy: proxySetup,
    hot: true,
    quiet: false,
    noInfo: false,
    stats: { colors: true }
  } ) );

  // Setup mocks if defined
  if ( options.mockConfig ) {

    console.log( 'Mocking following routes' );

    if ( _.isArray( options.mockConfig ) ) {

      _.each( options.mockConfig, function _iterateMultipleMocks( mockFile ) {

        _buildMockRoutes( mockFile, server.app );

      });

    } else {

      _buildMockRoutes( options.mockConfig, server.app );

    }

  }

  server.listen( options.port, options.host );


  /**
   * Build mock middleware
   *
   * @param {Buffer} content Resource return content
   * @param {string} status Resource return status
   *
   * @private
   */
  function _mockMiddleware( responseContentFileName, status ) {

    return generatedMockMiddleware;

    /**
     * Custom middleware for each specified mock
     */
    function generatedMockMiddleware( req, res ) {

      var responseContent = fs.readFileSync( responseContentFileName );

      res.writeHead( status );
      res.end( responseContent );

    }


  }

  // @TODO move to separate module as middleware
  /**
   * _buildMockRoutes - Iterate mock structure and build routes
   *
   * @private
   * @param {Object} mockFilePath mock definition object
   * @param {Object} app server instance
   */
  function _buildMockRoutes( mockFilePath, app ) {

    const rootPath = path.dirname( mockFilePath );

    var mock = require( cwd + '/' + mockFilePath );

    _.each( mock, function iterateMethods( methods, requestRoute ) {

      _.each( methods, function iterateRoutePaths( states, requestMethod ) {

        _.each( states, function iterateStates( responseContentFileName, responseState ) {

          const responseContentFilePath = path.join( rootPath, responseContentFileName );

          console.log( requestRoute, requestMethod, responseContentFilePath, responseState );

          app[requestMethod.toLowerCase()]( requestRoute, _mockMiddleware( responseContentFilePath, responseState ) );

        });

      });

    });

  }


}

module.exports = SuperServer;
