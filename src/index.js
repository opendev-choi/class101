const graph      = require("express-graphql");
const sqlite     = require("./module/sqlite.js");
const express    = require("express");
const bodyParser = require("body-parser");
const graphql_schema = require("./schema/graphqlSchema.js")
const { makeExecutableSchema } = require("graphql-tools");

const app = express();

const selectUser = require("./controller/user/selectUser.js");
const createUser = require("./controller/user/createUser.js");

const createComment = require("./controller/comment/createComment.js");
const selectComment = require("./controller/comment/selectComment.js");
const deleteComment = require("./controller/comment/deleteComment.js");
const updateComment = require("./controller/comment/updateComment.js");

const createPost = require("./controller/post/createPost.js");
const selectPost = require("./controller/post/selectPost.js");
const deletePost = require("./controller/post/deletePost.js");
const updatePost = require("./controller/post/updatePost.js");

const graphqlSingleUser = require("./controller/graphql/user/singleUserQuery.js")
const graphqlListUser = require("./controller/graphql/user/listUserQuery.js")

const graphqlSinglePost = require("./controller/graphql/post/singlePostQuery.js")
const graphqlListPost = require("./controller/graphql/post/listPostQuery.js")

const graphqlSingleComment = require("./controller/graphql/comment/singleCommentQuery.js")
const graphqlListComment = require("./controller/graphql/comment/listCommentQuery.js")

app.use(bodyParser.json());

// - Post
app.get("/post/:id", selectPost);

app.post("/post", createPost);

app.put("/post/:id", updatePost);

app.delete("/post/:id", deletePost);

// - comment
app.get("/comment/:id", selectComment);

app.post("/comment", createComment);

app.put("/comment/:id", updateComment);

app.delete("/comment/:id", deleteComment);

// - user
app.get("/user/:id", selectUser);

app.post("/user", createUser);


app.use("/graphql", graph({
    schema: makeExecutableSchema({
        typeDefs: graphql_schema,
        resolvers: {
            Query: {
                comment: graphqlSingleComment,
                comment_list: graphqlListComment,
                post: graphqlSinglePost,
                post_list: graphqlListPost,
                user: graphqlSingleUser,
                user_list: graphqlListUser
            }
        }
    }),
    graphiql: true,
}));


app.listen(3000, function () {
    console.log("app listening on port 3000!");
});
