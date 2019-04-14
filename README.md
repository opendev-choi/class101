# class101
class101 Coding test

## 사용 module
name|version
----|-------
Node.js|v11.14.0
express|4.16.4
sequelize|5.3.5
sqlite3|4.0.6 


## REST Api define & example
기본적으로는 단일 조회 (User 조회시 Post, Comment 같이 조회 불가능)

User + Post Comment 조회 필요시 Graphql 이용

### User
- Get
```sh
curl -XGET localhost:3000/user/1
```
- Post
```sh
curl -XPOST localhost:3000/user \
    -H "Content-Type: application/json" \
    -d '{"name":"John Doe"}'
```

### Post
- Get
```sh
curl -XGET localhost:3000/post/1
```
- Post
```sh
curl -XPOST localhost:3000/post \
    -H "Content-Type: application/json" \
    -d '{
      "author_id": 1,
      "title": "example title",
      "contents": "example contents"
    }'
```
- Put
```sh
curl -XPUT localhost:3000/post/1 \
    -H "Content-Type: application/json" \
    -d '{
      "title": "example change title",
      "contents": "example change contents"
    }'
```
- Delete
```sh
curl -XDELETE localhost:3000/post/1
```

### Comment
- Get
```sh
curl -XGET localhost:3000/comment/1
```
- Post
```sh
curl -XPOST localhost:3000/comment \
    -H "Content-Type: application/json" \
    -d '{
      "post_id": 1,
      "author_id": 1,
      "contents": "example comments"
    }'
```
- Put
```sh
curl -XPUT localhost:3000/comment/1 \
    -H "Content-Type: application/json" \
    -d '{
      "contents": "example change comments"
    }'
```
- Delete
```sh
curl -XDELETE localhost:3000/comment/1
```


## Graphql
스키마는 다음과 같습니다.

```
            type post {
                post_id: ID!,
                author: String,
                author_id: Int,
                title: String,
                contents: String,
                date: String,
                comments: [comment]
            }
            type comment {
                comment_id: ID!,
                author_id: Int,
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
```

먼저 post, comment, user 를 단일로 조회할수 있는 query 가 있으며,

post list, comment list, user list 를 조회할수 있는 query 가 있습니다.

다만, post list의 경우에는 comment, user list 의 경우에는 post, comment 와 같이 2 depth 이상의 목록은 조회할수 없게끔 되어 있습니다.

pagination 의 경우에는 offset 과 limit 기능을 이용하여 처리하였습니다.

###  Query Example
#### list query
- 유저 리스트 (user list)

query
```
query{
  user_list(user_page: 0, user_count_per_page: 3){
    user_id
    name
    regdate
  }
} 
```

result
```json
{
  "data": {
    "user_list": [
      {
        "user_id": "1",
        "name": "test_user1",
        "regdate": "2019-04-13T15:47:52.981Z"
      },
      {
        "user_id": "2",
        "name": "test_user2",
        "regdate": "2019-04-13T17:11:55.667Z"
      },
      {
        "user_id": "3",
        "name": "test_user3",
        "regdate": "2019-04-13T17:11:58.568Z"
      }
    ]
  }
}
``` 

- 댓글 리스트 (comment list)

query
```
query{
  comment_list(comment_page: 0, comment_count_per_page: 3){
    comment_id
    author_id
    author
    contents
    date
  }
}
```

result
```json
{
  "data": {
    "comment_list": [
      {
        "comment_id": "1",
        "author_id": 1,
        "author": "test_user1",
        "contents": "example change comments",
        "date": "2019-04-13T15:48:31.406Z"
      },
      {
        "comment_id": "3",
        "author_id": 1,
        "author": "test_user1",
        "contents": "example comments",
        "date": "2019-04-13T16:32:37.442Z"
      },
      {
        "comment_id": "4",
        "author_id": 1,
        "author": "test_user1",
        "contents": "example comments",
        "date": "2019-04-13T16:32:38.514Z"
      }
    ]
  }
}
```

- 글 리스트 (post list)

query
```
query{
  post_list(post_page: 0, post_count_per_page:3){
    post_id
    author
    author_id
    title
    contents
    date
  }
}
```

result
```json
{
  "data": {
    "post_list": [
      {
        "post_id": "3",
        "author": "test_user1",
        "author_id": 1,
        "title": "title",
        "contents": "contents",
        "date": "2019-04-13T16:32:03.521Z"
      },
      {
        "post_id": "4",
        "author": "test_user1",
        "author_id": 1,
        "title": "title",
        "contents": "contents",
        "date": "2019-04-13T16:32:05.320Z"
      },
      {
        "post_id": "6",
        "author": "test_user1",
        "author_id": 1,
        "title": "example title",
        "contents": "example contents",
        "date": "2019-04-14T04:30:20.100Z"
      }
    ]
  }
}
```

#### single query

- 유저 (user)

query
```
query{
	user(user_id: 1, 
    post_page: 0, post_count_per_page: 1, 
    comment_page: 0, comment_count_per_page: 1){
    user_id
    name
    regdate
    posted{
      post_id
      author
      author_id
      title
      contents
      date
    }
		commented{
      comment_id
      author_id
      author
      contents
      date
    }    
  }
}
```

result
```json
{
  "data": {
    "user": {
      "user_id": "1",
      "name": "jointestUser",
      "regdate": "2019-04-13T15:47:52.981Z",
      "posted": [
        {
          "post_id": "3",
          "author": "jointestUser",
          "author_id": 1,
          "title": "TT",
          "contents": null,
          "date": "2019-04-13T16:32:03.521Z"
        }
      ],
      "commented": [
        {
          "comment_id": "1",
          "author_id": 1,
          "author": "jointestUser",
          "contents": "example change comments",
          "date": "2019-04-13T15:48:31.406Z"
        }
      ]
    }
  }
}
```

- 글 (post)

query
```
query{
	post(post_id: 3, comment_page:0, comment_count_per_page: 3){
    post_id
    author
    author_id
    title
    contents
    date
    comments{
      comment_id
      author_id
      author
      contents
      date
    }
  }
}

```

result
```json
{
  "data": {
    "post": {
      "post_id": "3",
      "author": "jointestUser",
      "author_id": 1,
      "title": "TT",
      "contents": "contents",
      "date": "2019-04-13T16:32:03.521Z",
      "comments": [
        {
          "comment_id": "3",
          "author_id": 1,
          "author": "jointestUser",
          "contents": "DdDD",
          "date": "2019-04-13T16:32:37.442Z"
        },
        {
          "comment_id": "4",
          "author_id": 1,
          "author": "jointestUser",
          "contents": "DdDD",
          "date": "2019-04-13T16:32:38.514Z"
        },
        {
          "comment_id": "5",
          "author_id": 1,
          "author": "jointestUser",
          "contents": "DdDD",
          "date": "2019-04-13T16:32:39.089Z"
        }
      ]
    }
  }
}
```

- 댓글 (comment)

query
```
query{
	comment(comment_id: 10){
    comment_id
    author_id
    author
    contents
    date
  }
}
```

result
```json
{
  "data": {
    "comment": {
      "comment_id": "10",
      "author_id": 1,
      "author": "jointestUser",
      "contents": "example comments",
      "date": "2019-04-14T04:39:26.195Z"
    }
  }
}
```