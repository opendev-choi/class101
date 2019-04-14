const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    await sqlite.comment.destroy({
        where: { comment_id: req.params.id }
    });

    res.send({
        "status": "success"
    });
};