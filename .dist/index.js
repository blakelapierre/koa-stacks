'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBasicAuth = require('koa-basic-auth');

var _koaBasicAuth2 = _interopRequireDefault(_koaBasicAuth);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('babel/polyfill');

var authorizationRedirect = require('./authorizationRedirect');

module.exports = function (stacks, log) {
  log = log || function () {};

  return _lodash2['default'].mapValues(stacks, function (stack, stackName) {
    log('Constructing \'' + stackName + '\' stack');

    var authorization = stack.authorization;
    var middleware = stack.middleware;
    var routes = stack.routes;
    var server = (0, _koa2['default'])();
    var use = server.use;

    if (authorization) {
      var type = authorization.type;

      if (type === 'basic') {
        var _name = authorization.name;
        var pass = authorization.pass;

        use.call(server, authorizationRedirect);
        use.call(server, (0, _koaBasicAuth2['default'])({ name: _name, pass: pass }));
      }
    }

    var routeAuthorizations = getRouteAuthorizations(routes);

    if (routeAuthorizations.length > 0) {
      if (!authorization) use.call(server, authorizationRedirect);

      _lodash2['default'].each(routeAuthorizations, function (routeAuthorization) {
        var path = routeAuthorization.path;
        var authorization = routeAuthorization.authorization;
        var type = authorization.type;

        if (type === 'basic') {
          var _name2 = authorization.name;
          var pass = authorization.pass;

          use.call(server, (0, _koaMount2['default'])(path, (0, _koaBasicAuth2['default'])({ name: _name2, pass: pass })));
        }
      });
    }

    _lodash2['default'].each(middleware || [], use.bind(server));

    _lodash2['default'].each(routes, addRoute);

    return server;

    function getRouteAuthorizations() {
      var routes = arguments[0] === undefined ? {} : arguments[0];
      var parentPath = arguments[1] === undefined ? '' : arguments[1];

      return _lodash2['default'].filter(_lodash2['default'].flatten(_lodash2['default'].map(routes, function (definition, path) {
        var authorization = definition.authorization;
        var routes = definition.routes;

        path = parentPath + path;

        if (authorization) {
          return [{
            path: path,
            authorization: authorization
          }].concat(getRouteAuthorizations(routes, path));
        } else return getRouteAuthorizations(routes, path);
      })), function (value) {
        return value !== undefined;
      });
    }

    function addRoute(definition, path) {
      var methods = definition.methods;
      var routes = definition.routes;
      var authorization = definition.authorization;

      _lodash2['default'].each(methods, function (handler, method) {
        log('Adding ' + (authorization ? 'protected ' : '') + '\'' + method + '\' route at \'' + path + '\'');
        use.call(server, _koaRoute2['default'][method](path, handler));
      });

      _lodash2['default'].each(routes, addSubRoute);

      function addSubRoute(subDefinition, subPath) {
        addRoute(subDefinition, path + subPath);
      }
    }
  });
};
//# sourceMappingURL=index.js.map