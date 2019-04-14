const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    // validation check / need name only
    // { "name": "John Doe" }
    if (!req.body.name) {
        res.send({
            "status": "error",
            "reason": "field missing one of ['name']"
        })
    }

    qry_result = await sqlite.user.create({
        name: req.body.name,
        regdate: new Date().toISOString()
    });

    res.send({
        "status": "success",
        "id": qry_result.user_id
    })
}