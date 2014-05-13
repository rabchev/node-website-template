"use strict";

// Data Transfer Objects
var dtos = {
    Sample: {
        id: "Sample",
        title: "Sample",
        description: "This is a sample DTO.",
        required: ["name"],
        properties: {
            name: {
                type: "string",
                description: "The name of the sample DTO."
            }
        }
    }
};

exports.init = function (swagger) {
    var methods = {
        getSample: {
            spec: {
                description: "Sample Operations",
                path: "/sample/{key}",
                parameters : [
                    swagger.pathParam("key", "The ID of the sample item to get.", "string")
                ],
                notes: "Implementation notes on get sample item method.",
                summary: "Gets a sample item.",
                method: "GET",
                type: "Sample",
                nickname: "getSample"
            },
            action: function (req, resp) {
                resp.json({ name: req.params.key });
            }
        }
    };

    swagger.addModels(dtos);

    swagger.addGet(methods.getSample);
};
