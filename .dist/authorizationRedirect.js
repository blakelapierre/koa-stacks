'use strict';

var marked0$0 = [authorizationRedirect].map(regeneratorRuntime.mark);
module.exports = authorizationRedirect;

function authorizationRedirect(next) {
  return regeneratorRuntime.wrap(function authorizationRedirect$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return next;

      case 3:
        context$1$0.next = 14;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);

        if (!(401 == context$1$0.t0.status)) {
          context$1$0.next = 13;
          break;
        }

        this.status = 401;
        this.set('WWW-Authenticate', 'Basic');
        this.body = 'Unauthorized';
        context$1$0.next = 14;
        break;

      case 13:
        throw context$1$0.t0;

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this, [[0, 5]]);
}
//# sourceMappingURL=authorizationRedirect.js.map