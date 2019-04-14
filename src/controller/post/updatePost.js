const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    if (!req.body.contents || !req.body.title) {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['contents']"
        });
        return;
    }

    await sqlite.post.update({
        title: req.body.title,
        contents: req.body.contents
    }, {
        where: { post_id: req.params.id }
    });

    res.send({
        "status": "success"
    });
};