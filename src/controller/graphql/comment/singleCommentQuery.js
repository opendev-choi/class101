const sqlite     = require("../../../module/sqlite.js");

module.exports = async function get_comment(_, {comment_id}) {
    query_result = await sqlite.sequelize.query(`
                        SELECT 
                          comments.comment_id, comments.contents, comments.date,
                          users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        AND comments.comment_id = ?`,
        { replacements: [comment_id] });
    return query_result[0][0];
};