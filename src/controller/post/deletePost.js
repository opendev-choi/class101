const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    await sqlite.post.destroy({
        where: { post_id: req.params.id }
    });

    res.send({
        "status": "success"
    });
};