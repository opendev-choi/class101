schema = ` 
            type post {
                post_id: ID!,
                author: String,
                title: String,
                contents: String,
                date: String,
                comments: [comment]
            }
            type comment {
                comment_id: ID!,
                author: String,
                contents: String,
                date: String
            }
            type user {
                user_id: ID!, 
                name: String,
                regdate: String
                posted: [post],
                commented: [comment]
            }
            type Query{
                post(post_id: Int!, comment_page: Int, comment_count_per_page: Int): post,
                post_list(post_page: Int, post_count_per_page: Int): [post],
                comment(comment_id: Int!): comment,
                comment_list(comment_page: Int, comment_count_per_page: Int): [comment],
                user(user_id: Int!, post_page: Int, post_count_per_page: Int, comment_page: Int, comment_count_perf_page: Int): user,
                user_list(user_page: Int, user_count_per_page: Int): [user]
            }
            `

module.exports = schema