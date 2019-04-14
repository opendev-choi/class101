const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    if (!req.body.contents) {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['contents']"
        });
        return;
    }

    await sqlite.comment.update({
        contents: req.body.contents
    }, {
        where: { comment_id: req.params.id }
    });

    res.send({
        "status": "success"
    });
};