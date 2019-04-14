const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    // validation check
    if (!req.body.post_id || !req.body.author_id || !req.body.contents) {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['post_id', 'author_id', 'contents']"
        });
        return;
    }

    qry_result = await sqlite.comment.create({
        post_id: req.body.post_id,
        user_id: req.body.author_id,
        contents: req.body.contents,
        date: new Date().toISOString()
    })

    res.send({
        "status": "success",
        "id": qry_result.comment_id
    });
};