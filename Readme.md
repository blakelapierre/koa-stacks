#koa-stacks

A declarative way to create `koa` instances with prewired routes and middleware with optional basic HTTP authentication.

Example:

````js
import http from 'http';

import stacks from 'koa-stacks';
import bodyparser from 'koa-bodyparser';

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


http.createServer(test.callback()).listen(port);
console.log('HTTP server listing on port', port);
````

Run the server:
````
$ node .dist/tests/index.js
Constructing 'test' stack
Adding 'get' route at '/test'
Adding 'get' route at '/parameterized/:param'
Adding protected 'get' route at '/protected'
HTTP server listing on port 9999
````

Now run:
````
$ curl by:password@localhost:9999/protected
authorized!

$ curl localhost:9999/parameterized/my_param
my_param
````