
const express = require('express');

// 라우터 분리
const postRouter = require('./routes/post');

// 왜 post가 있는데 posts가 있느냐?
// 개발자마다 다름.. 걍 스타일임.. 단수 복수를 구분하려고...
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

// db
const db = require('./models');

// cors
const cors = require('cors');
const passportConfig = require('./passport');
const passport = require('passport');

// session
const session = require('express-session');
const cookieParser = require('cookie-parser');

// .env
const dotenv = require('dotenv');

const morgan = require('morgan');

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

// 서버에 응답, 요청 기록하기
// 프론트- 백 요청을 보낼때 cmd에 로그가 뜸
// 디버깅 용이
app.use(morgan('dev'));

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

// cors 설정
// cors는 보안정책이므로.. 실무에서는 전체 허용하면 위험... 설정해줘야함
app.use(cors({
    // creadentials로 쿠키공유 시 정확한 주소를 넣거나 true로 하거나
    // origin: 'http://localhost:3060',
    origin: true,

    // 브라우저-백엔드간의 로그인이되어도 포스트등록이안되므로
    // 쿠키 전달을 위해 true로 해야함
    credentials: true,
}));

// 중복되는 것들을 인수로 넣어줌으로써 postRouter에는 
// prefix로 /post/ 가 붙음
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

// 내부적으로 에러처리 미들웨어가 동작함
// 이런식으로 직접 에러처리 미들웨어를 만들 수 있다.
// 보통 에러를 특별하게 처리할때 사용 (에러페이지, 에러데이터가공등...)
// app.use((err, req, res, next) => { //... });

app.listen(3065, () => {
    console.log('서버 실행 중...');
});