var nconf = require("nconf"),
    insts = [],
    sep = ",",
    app,
    i;

nconf.argv({
    p: {
        alias: "app.port",
        describe: "The TCP port of the application instance. Defaults to 8095.",
        demand: false
    },
    h: {
        alias: "app.hostname",
        describe: "The IP address or domain name of the hosting machine. Defaults to \"localhost\".",
        demand: false
    },
    t: {
        alias: "app.protocol",
        describe: "Sepcifies the protocol of the application. Defaults to \"http\".",
        demand: false
    },
    k: {
        alias: "app.key",
        describe: "The path to a file containing private key in PEM format.",
        demand: false
    },
    c: {
        alias: "app.cert",
        describe: "The path to a file containing certificate key in PEM format.",
        demand: false
    },
    f: {
        alias: "app.pfx",
        describe: "The path to a file containing the private key, certificate and CA certs of the server in PFX or PKCS12 format.",
        demand: false
    },
    s: {
        alias: "app.swaggerInst",
        describe: "Specifies which server instance Swagger UI should use for API requests. Zero based index in the order of server declaration.",
        demand: false
    }
}).env({
    separator: "_",
    whitelist: [
        "app_port",
        "app_hostname",
        "app_protocol",
        "app_key",
        "app_cert",
        "app_pfx",
        "app_swaggerInst"
    ]
}).file({
    file: "../web-config.json"
}).defaults({
    app: {
        port: process.env.VCAP_APP_PORT || 8095,
        hostname: process.env.VCAP_APP_HOST || "localhost",
        protocol: "http",
        key: "",
        cert: "",
        pfx: "",
        swaggerInst: 0
    }
});

app = nconf.get("app");

if (typeof app.port === "string" && app.port.indexOf(sep) !== -1) {
    app.port = app.port.split(sep);

    if (app.protocol.indexOf(sep) !== -1) {
        app.protocol = app.protocol.split(sep);
    }
    if (app.hostname.indexOf(sep) !== -1) {
        app.hostname = app.hostname.split(sep);
    }
    if (app.key.indexOf(sep) !== -1) {
        app.key = app.key.split(sep);
    }
    if (app.cert.indexOf(sep) !== -1) {
        app.cert = app.cert.split(sep);
    }
    if (app.pfx.indexOf(sep) !== -1) {
        app.pfx = app.pfx.split(sep);
    }
}

if (Array.isArray(app.port)) {
    for (i = 0; i < app.port.length; i++) {
        insts.push({
            port: app.port[i],
            protocol: Array.isArray(app.protocol) ? app.protocol[i] : app.protocol,
            hostname: Array.isArray(app.hostname) ? app.hostname[i] : app.hostname,
            key: Array.isArray(app.key) ? app.key[i] : app.key,
            cert: Array.isArray(app.cert) ? app.cert[i] : app.cert,
            pfx: Array.isArray(app.pfx) ? app.pfx[i] : app.pfx
        });
    }
} else {
    insts.push(app);
}

exports.swaggerInst = isNaN(app.swaggerInst) ? 0 : Number(app.swaggerInst);
exports.instances = insts;
