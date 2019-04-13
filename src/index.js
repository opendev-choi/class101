const express = require('express');
const bodyParser = require('body-parser');
const SQLite = require('./sqlite.js');


const app = express();

console.log(SQLite['user']);

app.use(bodyParser.json());

// - Post
app.get('/post/:id', function (req, res) {
    SQLite['post'].findAll(
        {attributes: ['post_id', 'author', 'title', 'contents', 'date'],
            where: {post_id: req.params.id}}).then(post => {
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

    SQLite['post'].create({
        author: req.body["author_id"],
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

    SQLite['post'].update({
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
    SQLite['post'].destroy({
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
    console.log(SQLite['comment'].findAll(
        {attributes: ['comment_id', 'author', 'contents', 'date'],
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

    SQLite['comment'].create({
        post_id: req.body["post_id"],
        author: req.body["author_id"],
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

    SQLite['comment'].update({
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
    SQLite['comment'].destroy({
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
    console.log(SQLite['user'].findAll(
        {attributes: ['user_id', 'name', 'regdate'],
            where: {user_id: req.params.id}}).then(users => {
        res.send(JSON.stringify(users, null, 4));
    }));
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
    SQLite['user'].create({
        name: req.body["name"],
        regdate: new Date().toISOString() }).then(created_user => {
            console.log(created_user.user_id);
            res.send({
                "status": "success",
                "id": created_user.user_id
            })
        });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

