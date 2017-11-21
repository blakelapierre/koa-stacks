(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "http", "../", "koa-bodyparser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const http = require("http");
    const _1 = require("../");
    const bodyparser = require("koa-bodyparser");
    const port = process.env.port || 9999;
    const { test } = _1.default({
        test: {
            middleware: [bodyparser()],
            routes: {
                '/test': {
                    methods: {
                        'get': function* () {
                            this.body = 'test';
                            console.log('/test');
                        }
                    }
                },
                '/parameterized/:param': {
                    methods: {
                        'get': function* (param) {
                            this.body = param;
                            console.log(`/parameterized/${param}`);
                        }
                    }
                },
                '/protected': {
                    authorization: {
                        type: 'basic',
                        name: 'by',
                        pass: 'password'
                    },
                    methods: {
                        'get': function* () {
                            this.body = 'authorized!';
                            console.log('/protected');
                        }
                    }
                }
            }
        }
    }, console.log);
    console.log('test');
    http.createServer(test.callback()).listen(port);
    console.log('HTTP server listing on port', port);
});

//# sourceMappingURL=index.js.map
