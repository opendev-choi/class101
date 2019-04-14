const sqlite     = require("../../module/sqlite.js");

module.exports = async function (req, res) {
    qry_result = await sqlite.user.findAll({
        attributes: ["user_id", "name", "regdate"],
        where: {user_id: req.params.id}
    });
    res.send(qry_result);
};