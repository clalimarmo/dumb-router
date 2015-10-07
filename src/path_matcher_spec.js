require('babelify/polyfill');

const PathMatcher = require('./path_matcher');

describe('router path matcher', () => {
  it('matches routes', () => {
    const pathMatcher = PathMatcher('/users/:id');

    //matches
    expect(pathMatcher.matches('/users/3')).to.be.true;
    expect(pathMatcher.matches('/users/5')).to.be.true;
    expect(pathMatcher.matches('/users/bob')).to.be.true;
    expect(pathMatcher.matches('/users/bob/comments')).to.be.true;

    //non-matches
    expect(pathMatcher.matches('/users/')).to.be.false;
    expect(pathMatcher.matches('/comments')).to.be.false;
    expect(pathMatcher.matches('/')).to.be.false;
    expect(pathMatcher.matches('')).to.be.false;
  });

  it('gets params from dynamic portions of paths', () => {
    const pathMatcher = PathMatcher('/users/:userId/comments/:commentType');

    var paramValues = pathMatcher.params('/users/bob/comments/negative');
    expect(paramValues.userId).to.eq('bob');
    expect(paramValues.commentType).to.eq('negative');
  });

  it('returns the untested remainder of a matched path', () => {
    const pathMatcher = PathMatcher('/users/:userId');
    expect(pathMatcher.remainder('/users/5/comments')).to.eq('/comments');
  });
});
