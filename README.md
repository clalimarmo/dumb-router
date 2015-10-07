# dumb-router

Path -> Handler mapping and execution–that's it

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

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
#
# Initial commit
#
# Changes to be committed:
#	new file:   .gitignore
#	new file:   build/dumb-router.js
#	new file:   gulpfile.js/index.js
#	new file:   gulpfile.js/tasks/build.js
#	new file:   gulpfile.js/tasks/default.js
#	new file:   gulpfile.js/tasks/spec.js
#	new file:   karma.conf.js
#	new file:   package.json
#	new file:   src/descriptor_part.js
#	new file:   src/descriptor_part_spec.js
#	new file:   src/index.js
#	new file:   src/path_matcher.js
#	new file:   src/path_matcher_spec.js
#	new file:   src/route_spec.js
#	new file:   src/router_spec.js
#
