'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var port = process.env.port || 9999;

var _stacks = (0, _2['default'])({
  test: {
    middleware: [(0, _koaBodyparser2['default'])()],
    routes: {
      '/test': {
        methods: {
          'get': regeneratorRuntime.mark(function get() {
            return regeneratorRuntime.wrap(function get$(context$1$0) {
              while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                  this.body = 'test';
                  console.log('/test');

                case 2:
                case 'end':
                  return context$1$0.stop();
              }
            }, get, this);
          })
        }
      },
      '/parameterized/:param': {
        methods: {
          'get': regeneratorRuntime.mark(function get(param) {
            return regeneratorRuntime.wrap(function get$(context$1$0) {
              while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                  this.body = param;
                  console.log('/parameterized/' + param);

                case 2:
                case 'end':
                  return context$1$0.stop();
              }
            }, get, this);
          })
        }
      },
      '/protected': {
        authorization: {
          type: 'basic',
          name: 'by',
          pass: 'password'
        },
        methods: {
          'get': regeneratorRuntime.mark(function get() {
            return regeneratorRuntime.wrap(function get$(context$1$0) {
              while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                  this.body = 'authorized!';
                  console.log('/protected');

                case 2:
                case 'end':
                  return context$1$0.stop();
              }
            }, get, this);
          })
        }
      }
    }
  }
}, console.log);

var test = _stacks.test;

_http2['default'].createServer(test.callback()).listen(port);
console.log('HTTP server listing on port', port);
//# sourceMappingURL=../tests/index.js.map