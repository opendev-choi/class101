const sqlite     = require("../../../module/sqlite.js");

module.exports = async function get_comment_list(_, {comment_page, comment_count_per_page}) {
    comment_page = comment_page == undefined ? 0 : comment_page;
    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;

    query_result = await sqlite.sequelize.query(`
                        SELECT 
                          posts.post_id, posts.contents, posts.title, posts.date,
                          users.user_id as author_id, users.name as author
                        FROM POSTS, USERS WHERE POSTS.USER_ID = USERS.USER_ID
                        LIMIT ? OFFSET ?`,
        {replacements: [comment_count_per_page, comment_page * comment_count_per_page]});

    return query_result[0];
};