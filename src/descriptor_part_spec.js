require('babelify/polyfill');

const DescriptorPart = require('./descriptor_part');

describe('Path descriptor part:', () => {
  it('matches static path parts', () => {
    const part = DescriptorPart('animals', 1);
    expect(part.matches('/animals')).to.be.true;
  });

  it('matches based on position', () => {
    const part = DescriptorPart('comments', 3);
    expect(part.matches('/users/3/comments')).to.be.true;
    expect(part.matches('/comments')).to.be.false;
  });

  context('dynamic path part matching:', () => {
    var part;

    beforeEach(() => {
      part = DescriptorPart(':id', 2);
    });

    it('matches any value present in the corresponding position', () => {
      expect(part.matches('/users/1')).to.be.true;
      expect(part.matches('/users/bob')).to.be.true;
    });

    it('does not match paths that are not long enough', () => {
      expect(part.matches('/users')).to.be.false;
    });

    it('does not match paths that are empty in the corresponding position', () => {
      expect(part.matches('/users//')).to.be.false;
    });
  });

  it('can tell if it is dynamic', () => {
    const dynamicExamples = [
      ':id',
      ':username',
      ':1',
      ':0',
      ':32---afdasf',
    ];
    dynamicExamples.forEach((example) => {
      expect(DescriptorPart(example, 1).isDynamic()).to.be.true;
    });

    const staticExamples = [
      'animals',
      'elements',
      'p:atho:logical',
      '1',
      '2',
    ];
    staticExamples.forEach((example) => {
      expect(DescriptorPart(example, 1).isDynamic()).to.be.false;
    });
  });

  it('exposes a param name if it is dynamic', () => {
    const dynamicPart = DescriptorPart(':userId', 1);
    expect(dynamicPart.paramName()).to.eq('userId');
  });

  it('has an undefined param name if it is not dynamic', () => {
    const staticPart = DescriptorPart('us:ers', 1);
    expect(staticPart.paramName()).to.be.undefined;
  });

  context('dynamic path value', () => {
    var part;

    beforeEach(() => {
      part = DescriptorPart(':userId', 2);
    });

    it('is undefined if the path is not long enough', () => {
      expect(part.getPathValue('/')).to.be.undefined;
      expect(part.getPathValue('/users')).to.be.undefined;
    });

    it('returns the matching portion of the path', () => {
      expect(part.getPathValue('/users/2')).to.eq('2');
      expect(part.getPathValue('/users/bob')).to.eq('bob');
      expect(part.getPathValue('/users//')).to.eq('');
    });
  });
});
