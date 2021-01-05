module.exports = () => {
    return {
        https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js
        files: [{
            pattern: "libraries/*.js",
            instrument: false,
 load: false
        },

        {
            pattern: "js/*.js",
            instrument: false,
            load: false
        },

        "centipeed.html",
        "src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
        "!src/**/*.test.[jt]s?(x)",

        ],
        tests: [
            "test/*json-test.js",
            "p5.ts-master/DefinitelyTyped/types/p5/test/index.ts",
            "p5.ts-master/DefinitelyTyped/types/p5/test/unaugmented.ts"
        ],
        name: "Centipeed",
        env: {
            type: "node",
            params: {
                runner: `-r ${require.resolve("esm")}`
            },
            kind: "electron"
        },
        workers: {
            restart: true
        },
        debug: true
    };
};