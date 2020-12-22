// http 서버 실행
const http = require('http');
// 응답을 안보내면 특정시간(30초 정도?)후에 브라우저가 자동으로
// 응답 실패보낸다고 함.
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    // 이런식으로하면 너무 정신없어서 
    // 코드쪼개야함
    // if(res.method === 'GET'){
    //     if(req.url === '/api/posts'){

    //     }
    // }else if(req.method === 'POST'){

    // }

    // 응답 res
    // 요청이 뭔가 req
    res.write('<h1>hello node</h1>');
    res.write('<h2>hello node</h2>');
    res.write('<h3>hello node</h3>');
    res.write('<h4>hello node</h4>');

    // 마지막에 끝낼때 1번만!!
    res.end('hello node');
});

// !! back에서 작업하고나서는 서버 내리고 올려야함 node app.js! 
server.listen(3065, () => {
    console.log('서버 실행 중...');
});