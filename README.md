# dumb-router

Path -> Handler mapping and execution–that's it

## Usage

### Basic usage

```javascript
var Router = require('dumb-router');

var router = Router(); //factory; do not use `new`

router.register('/cats', meow);
router.register('/dogs', woof);

function meow() {
  console.log('meow!');
}

function woof() {
  console.log('woof!');
}

router.execute('/dogs'); // => woof
```

### Route parameters

```javascript
router.register('/say/:words', say);

function say(path, params) {
  console.log(params.words);
}

router.execute('/say/hello-world');
```

### Nesting routes

```javascript
router.register('/users/:userId', setUser, function(router) {
  router.register('/edit', showUserForm);
});

router.execute('/users/5/edit');
```

### Scoping routes

```javascript
router.register('/food', null, function(router) {
  router.register('/cookies', cookies);
  router.register('/cakes', cakes);
});
```

### Path building

I lied about `dumb-router` only doing path -> handler mapping and execution.
Being able to validate routes is useful, and we can do it by exposing a bit of
the route matching logic.

```javascript
router.register('/food' null, function(router) {
  router.register('/gourmet', gourmetFood);
  router.register('/fast', fastFood);
});

router.path('food') //throws error, no handler for "/food"
router.path('food', 'gourmet');       // => '/food/gourmet'
router.path('food', 'fast');          // => '/food/fast'
router.path('food', 'home-cooking');  //throws error, no route defined
```

## About

Some context around the origin of this class:

We used this Router class as part of our base Flux Store class, where
each Store had an instance of a Router. We only used the Router to
provide a convenient DSL for mapping Store private functions (state
mutators) to paths. Then, all such Stores would handle "navigate"
Actions from the Dispatcher by delegating to the Router's `execute`
method.

This decentralized routing pattern, where each store defined its own
response to navigation actions, arose because we wanted to avoid
exposing means of mutating store state.

The "single monolithic router" pattern, common in other frameworks,
requires that Stores expose some means of mutating their internal State.

Decentralized routing has some drawbacks: duplicated routes, and the
need to be loose when matching routes. For example, if two stores have
routers, and one store responds to "/users/" and another store responds
to "/users/new", and both Stores need to invoke their handlers when
navigating to "/users/new", the router has to consider "/users/new" a
match for "/users".
