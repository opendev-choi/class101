const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'sqlite.db'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Model = Sequelize.Model;
class User extends Model {}
User.init({
    // attributes
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    regdate: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'user'
});

class Post extends Model {}
Post.init({
    // attributes
    post_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // author: {
    //     type: Sequelize.INTEGER
    // },
    title: {
        type: Sequelize.STRING
    },
    contents: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'post'
});

// sequelize.sync()

class Comment extends Model {}
Comment.init({
    // attributes
    comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // post_id: {
    //     type: Sequelize.INTEGER
    // },
    // author: {
    //     type: Sequelize.INTEGER
    // },
    contents: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'comment'
});

User.hasMany(Comment, {foreignKey: 'user_id'});
User.hasMany(Post, {foreignKey: 'user_id'});

Post.hasMany(Comment, {foreignKey: 'post_id'})
schema = {
    "user": User,
    "comment": Comment,
    "post": Post,
    "sequelize": sequelize
}

sequelize.sync();


module.exports = schema
