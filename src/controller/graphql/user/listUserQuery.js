const sqlite     = require("../../../module/sqlite.js");

module.exports = async function get_comment_list(_, {user_page, user_count_per_page}) {
    user_page = user_page == undefined ? 0 : user_page;
    user_count_per_page = user_count_per_page == undefined ? 10 : user_count_per_page;

    query_result = await sqlite.user.findAll(
        {attributes: ["user_id", "name", "regdate"],
            limit:user_count_per_page,
            offset:user_page * user_count_per_page});;
    return query_result;
}