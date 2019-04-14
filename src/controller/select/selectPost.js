const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    qry_result = await sqlite.post.findAll(
        {
            attributes: ["post_id", "user_id", "title", "contents", "date"],
            where: {post_id: req.params.id}
        });
    res.send(qry_result);
};