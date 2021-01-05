var enviroments = {};

enviroments.staging = {
   'httpPort': 3000,
   'httpsPort': 3001,
   'envName': 'staging'
};

enviroments.production = {
   'httpPort': 5000,
   'httpsPort': 5001,
   'envName': 'production'
};

var currentEnvironment = typeof (process.env.NODE_ENV) == 'string'
var enviromentToExport = typeof (enviroments[currentEnvironment])
module.export = enviromentToExport;
