var users = [
    {
        _id: "1",
        name: "Bob Pott",
        nickname: "bob",
        password: "secret",
        email: "bob@example.com",
        phone: "+35986656060",
        roles: [
            "administrators"
        ]
    },
    {
        _id: "2",
        name: "Joe Haxby",
        nickname: "joe",
        password: "birthday",
        email: "joe@example.com",
        phone: "",
        roles: [
            "contributers"
        ]
    }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error("User " + id + " does not exist"));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username || user.email === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
