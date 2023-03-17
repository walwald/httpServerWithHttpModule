const http = require('http');
const server = http.createServer();

//mok-up data 선언할당
const users = [
  {
    id: 1,
    name: 'Rebekah Johnson',
    email: 'Glover12345@gmail.com',
    password: '123qwe',
  },
  {
    id: 2,
    name: 'Fabian Predovic',
    email: 'Connell29@gmail.com',
    password: 'password',
  },
];

const posts = [
  {
    id: 1,
    title: '간단한 HTTP API 개발 시작!',
    content: 'Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.',
    userId: 1,
  },
  {
    id: 2,
    title: 'HTTP의 특성',
    content: 'Request/Response와 Stateless!!',
    userId: 2,
  },
  {
    id: 3,
    title: '간단한 HTTP API 개발 시작!2',
    content:
      'Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.2',
    userId: 1,
  },
];

function makePostList() {
  const postList = posts.map((data) => {
    for (let i = 0; i < users.length; i++) {
      if (data.userId === users[i].id) {
        const userNameFound = users[i].name;
        //return userNameFound;
        const newElement = {
          userID: data.userId,
          userName: userNameFound,
          postingId: data.id,
          postingTitle: data.title,
          postingContent: data.content,
        };

        return newElement;
      }
    }
  });
  return postList;
}

//응답 function
const httpRequestListener = function (request, response) {
  const { url, method } = request;
  if (method === 'POST') {
    if (url === '/users') {
      let body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        const user = JSON.parse(body);
        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });

        //created의 상태 코드는 201
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'userCreated', users: users }));
      });
    } else if (url === '/posts') {
      let body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        const post = JSON.parse(body);
        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
        });

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'postCreated', posts: posts }));
      });
    }
  } else if (method === 'GET') {
    /*같은 posts 요청이고 method가 다르니까 같은 url 반복해도 됨*/
    if (url === '/ping') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'pong' }));
    } else if (url === '/posts') {
      const postList = makePostList();
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ data: postList }));
    } else if (url === '/users') {
      let body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        const user = JSON.parse(body);
        users.forEach((eachUser, index) => {
          if (eachUser.id === user.id) {
            //해당 유저에 대한 obj 만드는 함수 실행하기
            //userId에 해당하는 posting들 찾기
            const userPosting = [];
            posts.forEach((eachPost, index) => {
              if (eachPost.userId === eachUser.id) {
                userPosting.push({
                  postingId: eachPost.id,
                  postingName: eachPost.title,
                  postingContent: eachPost.content,
                });
              }
            });

            const userObj = {
              userID: eachUser.id,
              userName: eachUser.name,
              postings: userPosting,
            };
            response.writeHead(200, { 'Content-Type': 'application/json' });
            //postList 배열에서 update한 객체만 찾아서 응답하기
            response.end(JSON.stringify({ data: userObj }));
          }
        });
      });
    }
  } else if (method === 'PATCH') {
    if (url === '/update') {
      let body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        const post = JSON.parse(body);
        //업데이트 요청된 post의 id를 참조하여 array의 index 도출하고 array.index 값 업데이트
        posts.forEach((eachPost, index) => {
          if (eachPost.id === post.id) {
            eachPost.content = post.content;
            const postList = makePostList();
            const updatedPost = postList[index];
            response.writeHead(200, { 'Content-Type': 'application/json' });
            //postList 배열에서 update한 객체만 찾아서 응답하기
            response.end(JSON.stringify({ data: updatedPost }));
            return;
          }
        });
      });
    }
  } else if (method === 'DELETE') {
    if (url === '/posts') {
      let body = '';
      request.on('data', (data) => {
        body += data;
      });
      request.on('end', () => {
        const post = JSON.parse(body);
        posts.forEach((eachPost, index) => {
          if (eachPost.id === post.id) {
            posts.splice(index, 1);
          }
        });
        response.writeHead(200, { 'Content-Type': 'application/json' });
        //postList 배열에서 update한 객체만 찾아서 응답하기
        response.end(JSON.stringify({ message: 'postingDeleted' }));
        console.log(posts);
      });
    }
  }
};

server.on('request', httpRequestListener);

const port = 8000;
const ip = '127.0.0.1';

server.listen(port, ip, function () {
  console.log('Listening to request on port 8000');
});
