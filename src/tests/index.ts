import * as http from 'http';

import stacks from '../';

import * as bodyparser from 'koa-bodyparser';

const port = process.env.port || 9999;

const {
  test
} = stacks({
  test: {
    middleware: [bodyparser()],
    routes: {
      '/test': {
        methods: {
          'get': function *() {
            this.body = 'test';
            console.log('/test');
          }
        }
      },
      '/parameterized/:param': {
        methods: {
          'get': function *(param) {
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
          'get': function *() {
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