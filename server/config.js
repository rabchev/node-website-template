var nconf = require("nconf");

nconf
    .argv({
        "app.port": {
            describe: "Example description for usage generation",
            demand: false
        },
        "app.host": {
            describe: "Example description for usage generation",
            demand: false
        },
        "app.protocol": {
            describe: "Example description for usage generation",
            demand: false
        }
    })
    .env({
        separator: "__",
        whitelist: [
            "APP__PORT",
            "APP__HOST",
            "APP__PROTOCOL",
            "APP2__PORT",
            "APP2__HOST",
            "APP2__PROTOCOL",
            "APP3__PORT",
            "APP3__HOST",
            "APP3__PROTOCOL",
        ]
    })
    .file({ file: "../web-config.json" })
    .defaults({
        app: {
            port: process.env.VCAP_APP_PORT || 8095,
            hostname: process.env.VCAP_APP_HOST || "localhost",
            protocol: process.env.VCAP_APP_PROTOCOL || "http"
        }
    });

exports.app = nconf.get("app");
