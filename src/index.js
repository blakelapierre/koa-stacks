require('babel/polyfill');

import koa from 'koa';
import auth from 'koa-basic-auth';
import mount from 'koa-mount';
import route from 'koa-route';
import _ from 'lodash';

const authorizationRedirect = require('./authorizationRedirect');

module.exports = (stacks, log) => {
  log = log || (() => {});

  return _.mapValues(stacks, (stack, stackName) => {
    log(`Constructing '${stackName}' stack`);

    const {
      authorization,
      middleware,
      routes
    } = stack;

    const server = koa(),
          {use} = server;

    if (authorization) {
      const {type} = authorization;

      if (type === 'basic') {
        const {name, pass} = authorization;

        use.call(server, authorizationRedirect);
        use.call(server, auth({name, pass}));
      }
    }

    const routeAuthorizations = getRouteAuthorizations(routes);

    if (routeAuthorizations.length > 0) {
      if (!authorization) use.call(server, authorizationRedirect);

      _.each(routeAuthorizations, routeAuthorization => {
        const {path, authorization} = routeAuthorization,
              {type} = authorization;

        if (type === 'basic') {
          const {name, pass} = authorization;

          use.call(server, mount(path, auth({name, pass})));
        }
      });
    }

    _.each(middleware || [], use.bind(server));

    _.each(routes, addRoute);

    return server;

    function getRouteAuthorizations(routes = {}, parentPath = '') {
      return _.filter(_.flatten(_.map(routes, (definition, path) => {
        const {authorization, routes} = definition;

        path = parentPath + path;

        return (authorization ? [{path, authorization}] : []).concat(getRouteAuthorizations(routes, path));
      })), value => value !== undefined);
    }

    function addRoute(definition, path) {
      const {methods, routes, authorization} = definition;

      _.each(methods, (handler, method) => {
        log(`Adding ${authorization ? 'protected ' : ''}'${method}' route at '${path}'`);
        use.call(server, route[method](path, handler));
      });

      _.each(routes, addSubRoute);

      function addSubRoute(subDefinition, subPath) {
        addRoute(subDefinition, path + subPath);
      }
    }
  });
};