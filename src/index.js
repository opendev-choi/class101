const express = require('express');
const SQLite = require('./sqlite.js');

const app = express();

console.log(SQLite['user'])

// - Post
app.get('/post/:id', function (req, res) {
    console.log(SQLite['post'].findAll(
        {attributes: ['post_id', 'author', 'title', 'contents', 'date'],
            where: {post_id: req.params.id}}).then(post => {
        res.send(JSON.stringify(post, null, 4));
    }));
});

app.post('/post/:id', function (req, res) {
});

app.put('/post/:id', function (req, res) {
});

app.delete('/post/:id', function (req, res) {
});

// - comment
app.get('/comment/:id', function (req, res) {
    console.log(SQLite['comment'].findAll(
        {attributes: ['comment_id', 'author', 'contents', 'date'],
            where: {comment_id: req.params.id}}).then(comment => {
        res.send(JSON.stringify(comment, null, 4));
    }));
});

app.post('/comment/:id', function (req, res) {
});

app.put('/comment/:id', function (req, res) {
});

app.delete('/comment/:id', function (req, res) {
});

// - user
app.get('/user/:id', function (req, res) {
    console.log(SQLite['user'].findAll(
        {attributes: ['user_id', 'name', 'regdate'],
            where: {user_id: req.params.id}}).then(users => {
        res.send(JSON.stringify(users, null, 4));
    }));
});

app.post('/user/:id', function (req, res) {
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

