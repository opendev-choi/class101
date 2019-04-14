const graph      = require("express-graphql");
const sqlite     = require("./module/sqlite.js");
const express    = require("express");
const bodyParser = require("body-parser");
const graphql_schema = require("./schema/graphqlSchema.js")
const { makeExecutableSchema } = require("graphql-tools");

const app = express();

const createComment = require("./controller/create/createComment.js");
const createUser = require("./controller/create/createUser.js");
const createPost = require("./controller/create/createPost.js");

const selectComment = require("./controller/select/selectComment.js");
const selectUser = require("./controller/select/selectUser.js");
const selectPost = require("./controller/select/selectPost.js");

const deleteComment = require("./controller/delete/deleteComment.js");
const deletePost = require("./controller/delete/deletePost.js");

const updateComment = require("./controller/update/updateComment.js");
const updatePost = require("./controller/update/updatePost.js");

const graphqlSingleUser = require("./controller/graphql/single/userQuery.js")
const graphqlSinglePost = require("./controller/graphql/single/postQuery.js")
const graphqlSingleComment = require("./controller/graphql/single/commentQuery.js")

const graphqlListUser = require("./controller/graphql/list/userQuery.js")
const graphqlListPost = require("./controller/graphql/list/postQuery.js")
const graphqlListComment = require("./controller/graphql/list/commentQuery.js")

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
