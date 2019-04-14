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

User
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

Post
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

Comment
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

