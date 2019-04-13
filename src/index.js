const graph      = require('express-graphql');
const sqlite     = require('./sqlite.js');
const express    = require('express');
const bodyParser = require('body-parser');
const graphql_schema = require('./graphql_schema.js')
const { makeExecutableSchema } = require('graphql-tools');

const app = express();

app.use(bodyParser.json());

// - Post
app.get('/post/:id', function (req, res) {
    sqlite['post'].findAll(
        {
            attributes: ['post_id', 'user_id', 'title', 'contents', 'date'],
            where: {post_id: req.params.id}}).then(post => {
        console.log(post);
        res.send(JSON.stringify(post, null, 4));
    });
});

app.post('/post', function (req, res) {
    // validation check
    if (req.body["author_id"] == undefined || req.body["title"] == undefined)
    {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['author_id', title]"
        });
        return;
    }

    sqlite['post'].create({
        user_id: req.body["author_id"],
        title: req.body["title"],
        contents: req.body["contents"],
        date: new Date().toISOString()
    }).then(created_post => {
        console.log(created_post.post_id);
        res.send({
            "status": "success",
            "id": created_post.post_id
        })
    });
});

app.put('/post/:id', function (req, res) {
    if (req.body["contents"] == undefined)
    {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['contents']"
        });
        return;
    }

    sqlite['post'].update({
        contents: req.body["contents"]
    }, {
        where: { post_id: req.params.id }
    })
        .then(() => {
            res.send({
                "status": "success"
            })
        });
});

app.delete('/post/:id', function (req, res) {
    sqlite['post'].destroy({
        where: { post_id: req.params.id }
    })
        .then(() => {
            res.send({
                "status": "success"
            })
        });
});

// - comment
app.get('/comment/:id', function (req, res) {
    console.log(sqlite['comment'].findAll(
        {
            attributes: ['comment_id', 'user_id', 'post_id', 'contents', 'date'],
            where: {comment_id: req.params.id}}).then(comment => {
        res.send(JSON.stringify(comment, null, 4));
    }));
});

app.post('/comment', function (req, res) {
    // validation check
    if (req.body["post_id"] == undefined || req.body["author_id"] == undefined  ||
        req.body["contents"] == undefined)
    {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['post_id', 'author_id', 'contents']"
        });
        return;
    }

    sqlite['comment'].create({
        post_id: req.body["post_id"],
        user_id: req.body["author_id"],
        contents: req.body["contents"],
        date: new Date().toISOString()
    }).then(created_comment => {
        console.log(created_comment.comment_id);
        res.send({
            "status": "success",
            "id": created_comment.comment_id
        })
    });
});

app.put('/comment/:id', function (req, res) {
    if (req.body["contents"] == undefined)
    {
        res.send({
            "status": "error",
            "reason": "field missing not null field one of ['contents']"
        });
        return;
    }

    sqlite['comment'].update({
        contents: req.body["contents"]
    }, {
        where: { comment_id: req.params.id }
    })
    .then(() => {
        res.send({
            "status": "success"
        })
    })
});

app.delete('/comment/:id', function (req, res) {
    sqlite['comment'].destroy({
        where: { comment_id: req.params.id }
    })
        .then(() => {
            res.send({
                "status": "success"
            })
        });
});

// - user
app.get('/user/:id', function (req, res) {
    sqlite['user'].findAll(
        {attributes: ['user_id', 'name', 'regdate'],
            where: {user_id: req.params.id}}).then(users => {
        res.send(JSON.stringify(users, null, 4));
    });
});

app.post('/user', function (req, res) {
    // validation check / need name only
    // { "name": "John Doe" }
    if (req.body["name"] == undefined)
    {
        res.send({
            "status": "error",
            "reason": "field missing one of ['name']"
        })
    }
    sqlite['user'].create({
        name: req.body["name"],
        regdate: new Date().toISOString() }).then(created_user => {
            console.log(created_user.user_id);
            res.send({
                "status": "success",
                "id": created_user.user_id
            })
        });
});


app.use('/graphql', graph({
    schema: makeExecutableSchema({
        typeDefs: graphql_schema,
        resolvers: {
            Query: {
                comment: async function get_comment(_, {comment_id}) {
                    query_result = await sqlite['sequelize'].query(`
                        SELECT 
                          comments.comment_id, comments.contents, comments.date,
                          users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        AND comments.comment_id = ?`,
                        { replacements: [comment_id] });
                    return query_result[0][0];
                },
                comment_list: async function get_comment_list(_, {comment_page, comment_count_per_page}) {
                    comment_page = comment_page == undefined ? 0 : comment_page;
                    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;

                    query_result = await sqlite['sequelize'].query(`
                        SELECT 
                          comments.comment_id, comments.contents, comments.date,
                          users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        LIMIT ? OFFSET ?`,
                        {replacements: [comment_count_per_page, comment_page * comment_count_per_page]});

                    return query_result[0];
                },
                post: async function get_comment(_, {post_id, comment_page, comment_count_per_page}) {
                    comment_page = comment_page == undefined ? 0 : comment_page;
                    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;

                    query_result = await sqlite['sequelize'].query(`
                        SELECT 
                          posts.post_id, posts.contents, posts.title, posts.date,
                          users.user_id as author_id, users.name as author
                        FROM POSTS, USERS WHERE POSTS.USER_ID = USERS.USER_ID
                        AND POSTS.post_id = ?`,
                        { replacements: [post_id] });

                    comment_list = await sqlite['sequelize'].query(`
                        SELECT 
                          comments.comment_id, comments.contents, comments.date,
                          users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        AND comments.post_id = ? LIMIT ? OFFSET ?`,
                        { replacements: [post_id, comment_count_per_page, comment_page * comment_count_per_page] });

                    query_result[0][0]['comments'] = comment_list[0]
                    return query_result[0][0];
                },
                post_list: async function get_comment_list(_, {comment_page, comment_count_per_page}) {
                    comment_page = comment_page == undefined ? 0 : comment_page;
                    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;

                    query_result = await sqlite['sequelize'].query(`
                        SELECT 
                          posts.post_id, posts.contents, posts.title, posts.date,
                          users.user_id as author_id, users.name as author
                        FROM POSTS, USERS WHERE POSTS.USER_ID = USERS.USER_ID
                        LIMIT ? OFFSET ?`,
                        {replacements: [comment_count_per_page, comment_page * comment_count_per_page]});

                    return query_result[0];
                },
                user: async function get_comment(_, {user_id, post_page, post_count_per_page, comment_page, comment_count_per_page}) {
                    comment_page = comment_page == undefined ? 0 : comment_page;
                    comment_count_per_page = comment_count_per_page == undefined ? 10 : comment_count_per_page;
                    post_page = post_page == undefined ? 0 : post_page;
                    post_count_per_page = post_count_per_page == undefined ? 10 : post_count_per_page;

                    query_result = await sqlite['user'].findAll(
                        {attributes: ['user_id', 'name', 'regdate'],
                            where: {user_id: user_id}});

                    comment_list = await sqlite['sequelize'].query(`
                        SELECT 
                            comments.comment_id, comments.contents, comments.date,
                            users.user_id as author_id, users.name as author
                        FROM COMMENTS, USERS WHERE COMMENTS.USER_ID = USERS.USER_ID
                        AND USERS.USER_ID = ? LIMIT ? OFFSET ?`,
                        { replacements: [user_id, comment_count_per_page, comment_page * comment_count_per_page] });

                    post_list = await sqlite['sequelize'].query(`
                        SELECT 
                            posts.post_id, posts.contents, posts.title, posts.date,
                            users.user_id as author_id, users.name as author
                        FROM POSTS, USERS WHERE POSTS.USER_ID = USERS.USER_ID
                        AND USERS.USER_ID = ? LIMIT ? OFFSET ?`,
                        { replacements: [user_id, post_count_per_page, post_page * post_count_per_page] });

                    query_result[0]['commented'] = comment_list[0]
                    query_result[0]['posted'] = post_list[0]
                    return query_result[0];
                },
                user_list:async function get_comment_list(_, {user_page, user_count_per_page}) {
                    user_page = user_page == undefined ? 0 : user_page;
                    user_count_per_page = user_count_per_page == undefined ? 10 : user_count_per_page;

                    query_result = await sqlite['user'].findAll(
                        {attributes: ['user_id', 'name', 'regdate'],
                            limit:user_count_per_page,
                            offset:user_page * user_count_per_page});;
                    return query_result;
                }
            }
        }
    }),
    graphiql: true,
}));


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
