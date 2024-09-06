"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const package_json_1 = require("../../../package.json");
const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-boilerplate API documentation',
        version: package_json_1.version,
        license: {
            name: 'MIT',
            url: 'https://github.com/djibril6/restapi-nodejs-boilerplate/blob/main/LICENSE',
        },
    },
    servers: [
        {
            url: `http://localhost:${config_1.config.port}/v1`,
        },
    ],
};
exports.default = swaggerDef;
//# sourceMappingURL=swaggerDef.js.map