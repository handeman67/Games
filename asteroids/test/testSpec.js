describe('Wallaby.js ES7 support via Babel', () => {

  var userRepo = new LEVELS();

  it('should support class props', () => {
    expect(userRepo.e).toBe(this);
  });

 

  it('should support object spread', () => {
    let { x, y, ...z } = {x: 1, y: 2, a: 3, b: 4};
    expect(z).toEqual({a: 3, b: 4});
  });

});