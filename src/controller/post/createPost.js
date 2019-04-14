const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    // validation check
    if (!req.body.author_id || !req.body.title) {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['author_id', 'title']"
        });
        return;
    }

    created_post = await sqlite.post.create({
        user_id: req.body.author_id,
        title: req.body.title,
        contents: req.body.contents,
        date: new Date().toISOString()
    });

    res.send({
        "status": "success",
        "id": created_post.post_id
    })
};