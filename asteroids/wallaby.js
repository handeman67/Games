module.exports = function (wallaby) {
<<<<<<< HEAD
  return {
    files: [
      'js/*.js',
      'css/*.css',
      'libraries/*.js'
    ],

    tests: [
      'test/**/*Spec.js'
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
=======

  return {
    name: 'astroid',
    files: [
      {
        'pattern': ' index.html',/*? */
        instrument: false,
      },

      {
        'pattern': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.js',
        instrument: false,

      },
      {
        'pattern': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.js',
        instrument: false,

      },
      {
        'pattern': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.sound.js',
        instrument: false,

      },
      // {
      //   'pattern': 'libraries/*.js',
      //   instrument: false,

      // },



      { pattern: 'js/*.js', load: false },
      // !'./js/sound.js' 


      { pattern: 'src/libs/*.js', load: false },
      { pattern: "test/**/*Spec.js", ignore: true }
    ],

    "tests": [
      { pattern: "test/**/*Spec.js", load: false }
    ],
    postprocessor: wallabyPostprocessor,

    setup: function () {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    },
    compilers: {
      '**/*.js*': wallaby.compilers.babel()
    },
    testFramework: 'mocha',
    'env': {

      'kind': 'chrome'
    },
    'workers': {
      'restart': true
    },
    'debug': true
  };
}
>>>>>>> 6e63db0a0b5a0b2aebb08a2ab60a835bbb8dfd3c
