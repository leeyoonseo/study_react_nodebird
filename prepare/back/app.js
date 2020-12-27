const express = require('express');

// 라우터 분리
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

// db
const db = require('./models');

// CORS
const cors = require('cors');

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

// CORS 설정
// CORS는 보안정책이므로.. 실무에서는 전체 허용하면 위험... 설정해줘야함
app.use(cors({
    origin: '*',
    credentials: false, // 나중에 true로해야함.
}));
// 예시
// app.use(cors({
//     origin: 'http://nodebird.com'
// }));
// origin: true로 설정하면 *대신 보낸곳의 주소가 자동으로 들어간다.

// 중복되는 것들을 인수로 넣어줌으로써 postRouter에는 
// prefix로 /post/ 가 붙음
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});