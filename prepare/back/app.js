const express = require('express');

// 라우터 분리
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

// db
const db = require('./models');

const app = express();

// promise라고 함
// 서버실행 시 같이 실행됨
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공!');
    })
    .catch(console.error);

// 다른 라우터보다 위에 있어야함 (미들웨어는 순서대로 실행되기 때문에 라우터 실행전에 선언되어야함)
// json, urlencoded는 프론트에서 데이터 넘기면 해석해서 req.body안에 넣어주는 역할
app.use(express.json()); // json 형식데이터로 처리
app.use(express.urlencoded({ extended: true })); // form submit했을때 url인코딩방식으로 넘어온 데이터 처리..

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
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});