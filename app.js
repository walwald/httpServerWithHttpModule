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
];

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

        response.writeHead(200, { 'Content-Type': 'application/json' });
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
    if (url === '/postlist') {
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
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ data: postList }));
    }
  }
};

server.on('request', httpRequestListener);

const port = 8000;
const ip = '127.0.0.1';

server.listen(port, ip, function () {
  console.log('Listening to request on port 8000');
});
