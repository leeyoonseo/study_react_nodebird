const express = require('express');

// 라우터 분리
const postRouter = require('./routes/post');

const app = express();

app.get('/', (req, res) => {
    res.send('hellow express');
});

app.get('/posts', (req, res) => {
    res.json([
        { id: 1, content: 'hello1'},
        { id: 2, content: 'hello2'},
        { id: 3, content: 'hello3'},
    ]);
});

// 중복되는 것들을 인수로 넣어줌으로써 postRouter에는 
// prefix로 /post/ 가 붙음
app.use('/post', postRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});