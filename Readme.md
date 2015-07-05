#koa-stacks

Combines [`koa-route`](https://github.com/koajs/route), [`koa-mount`](https://github.com/koajs/mount), and [`koa-basic-auth`](https://github.com/koajs/basic-auth) to provide a declarative way to create [`koa`](https://github.com/koajs/koa) instances with prewired routes and middleware with optional and highly-configurable basic HTTP authentication.

Install:
````
$ npm install --save koa-stacks
````

Example:

````js
import http from 'http';

import constructStacks from 'koa-stacks';
import bodyparser from 'koa-bodyparser';

const port = process.env.port || 9999;

const {
  test
} = constructStacks({
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

$ curl localhost:9999/protected
Unauthorized

$ curl localhost:9999/parameterized/my_param
my_param
````


You can place
````
authorization: {
  type: 'basic',
  name: 'user_name',
  pass: 'some_password'
}
````
directly on your stack:
````
{
  myStack: {
    authorization: {
      type: 'basic',
      name: 'my',
      pass: 'pass'
    },
    routes: {
      '/': {
        methods: {
          'get': getRoot
        }
      }
    }
  }
}
````
or directly on your routes:
````
{
  myStack: {
    routes: {
      '/': {
        authorization: {
          type: 'basic',
          name: 'my',
          pass: 'pass'
        },
        methods: {
          'get': getRoot
        }
      }
    }
  }
}
````

Nested authorizations not tested!