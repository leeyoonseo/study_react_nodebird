
const express = require('express')
// 라우터 분리
const postRouter = require('./routes/post');
const userRouter = require('./routes/user')
// db
const db = require('./models')
// cors
const cors = require('cors');
const passportConfig = require('./passport');
const passport = require('passport')
// session
const session = require('express-session');
const cookieParser = require('cookie-parser');

// .env
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// promise라고 함
// 서버실행 시 같이 실행됨
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공!');
    })
    .catch(console.error);

passportConfig();

// 다른 라우터보다 위에 있어야함 (미들웨어는 순서대로 실행되기 때문에 라우터 실행전에 선언되어야함)
// json, urlencoded는 프론트에서 데이터 넘기면 해석해서 req.body안에 넣어주는 역할
app.use(express.json()); // json 형식데이터로 처리
app.use(express.urlencoded({ extended: true })); // form submit했을때 url인코딩방식으로 넘어온 데이터 처리.
// session 설정
// 쿠키, 세션이 필요한것은 브라우저-서버가 같은 정보를 가지고있어야하기 때문에
// 실제 정보대신 랜덤한 토큰을 쿠키로 보내줌, 그리고 서버에 값을 저장해서 서로연결됨을 인식함
app.use(cookieParser('nodebirdsecret'));
app.use(session({
    saveUninitialized: false,
    resave: false,
    // 쿠키에 랜덤한 문자열을 보내준다햇는데
    // secret이 해킹당하면 정보가 노출될 수 있음
    // 그래서 꼼꼼히 숨겨둠
    // secret: 'nodebirdsecret',
    secret: process.env.COOKIE_SECRET,
}));

app.use(passport.initialize());
app.use(passport.session())
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

// cors 설정
// cors는 보안정책이므로.. 실무에서는 전체 허용하면 위험... 설정해줘야함
app.use(cors({
    origin: '*',
    credentials: false, // 나중에 true로해야함.
}));

// 중복되는 것들을 인수로 넣어줌으로써 postRouter에는 
// prefix로 /post/ 가 붙음
app.use('/post', postRouter);
app.use('/user', userRouter);

app.listen(3065, () => {
    console.log('서버 실행 중...');
});