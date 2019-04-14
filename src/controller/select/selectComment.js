const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    qry_result = await sqlite.comment.findAll(
        {
            attributes: ["comment_id", "user_id", "post_id", "contents", "date"],
            where: {comment_id: req.params.id}
        });

    res.send(qry_result);
};