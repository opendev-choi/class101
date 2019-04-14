const sqlite     = require("../../../module/sqlite.js");

module.exports = async function get_comment(_, {post_id, comment_page, comment_count_per_page}) {
    comment_page = comment_page == undefined ? 0 : comment_page;
    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;

    query_result = await sqlite.sequelize.query(`
                        SELECT 
                          posts.post_id, posts.contents, posts.title, posts.date,
                          users.user_id as author_id, users.name as author
                        FROM POSTS, USERS WHERE POSTS.USER_ID = USERS.USER_ID
                        AND POSTS.post_id = ?`,
        { replacements: [post_id] });

    comment_list = await sqlite.sequelize.query(`
                        SELECT 
                          comments.comment_id, comments.contents, comments.date,
                          users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        AND comments.post_id = ? LIMIT ? OFFSET ?`,
        { replacements: [post_id, comment_count_per_page, comment_page * comment_count_per_page] });

    query_result[0][0].comments = comment_list[0]
    return query_result[0][0];
};