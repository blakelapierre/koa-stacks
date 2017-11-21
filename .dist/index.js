(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "koa", "koa-basic-auth", "koa-mount", "koa-route", "lodash", "./authorizationRedirect"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const koa = require("koa");
    const auth = require("koa-basic-auth");
    const mount = require("koa-mount");
    const route = require("koa-route");
    const _ = require("lodash");
    const authorizationRedirect_1 = require("./authorizationRedirect");
    // const authorizationRedirect = require('./authorizationRedirect');
    exports.default = (stacks, log) => {
        log = log || (() => { });
        return _.mapValues(stacks, (stack, stackName) => {
            log(`Constructing '${stackName}' stack`);
            const { authorization, middleware, routes } = stack;
            const server = new koa(), { use } = server;
            if (authorization) {
                const { type } = authorization;
                if (type === 'basic') {
                    const { name, pass } = authorization;
                    use.call(server, authorizationRedirect_1.default);
                    use.call(server, auth({ name, pass }));
                }
            }
            const routeAuthorizations = getRouteAuthorizations(routes);
            if (routeAuthorizations.length > 0) {
                if (!authorization)
                    use.call(server, authorizationRedirect_1.default);
                _.each(routeAuthorizations, routeAuthorization => {
                    const { path, authorization } = routeAuthorization, { type } = authorization;
                    if (type === 'basic') {
                        const { name, pass } = authorization;
                        use.call(server, mount(path, auth({ name, pass })));
                    }
                });
            }
            _.each(middleware || [], use.bind(server));
            _.each(routes, addRoute);
            return server;
            function getRouteAuthorizations(routes = {}, parentPath = '') {
                return _.filter(_.flatten(_.map(routes, (definition, path) => {
                    const { authorization, routes } = definition;
                    path = parentPath + path;
                    return (authorization ? [{ path, authorization }] : []).concat(getRouteAuthorizations(routes, path));
                })), value => value !== undefined);
            }
            function addRoute(definition, path) {
                const { methods, routes, authorization } = definition;
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
});

//# sourceMappingURL=index.js.map
