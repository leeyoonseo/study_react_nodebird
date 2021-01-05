const express = require('express');
const { Op } = require('sequelize');

// 비밀번호 암호화
const bcrypt = require('bcrypt');

// 로그인 전략
const passport = require('passport');

// db 만든거
const { User, Post, Image, Comment } = require('../models');

// 미들웨어
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 새로고침할 때마다 보낼 요청 (로그인 유지하기 위해서)
router.get('/', async (req, res, next) => {
    try{
        if(req.user){
            // 여기서 데이터 가공하기위해 정보를 찾아온다.
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: [ 'password' ]
                },

                // 데이터 효율을 위해서 id만 가져온다.
                include: [{ 
                    model: Post ,
                    attributes: [ 'id' ],
                },{ 
                    model: User,
                    as: 'Followings',
                    attributes: [ 'id' ],
                },{ 
                    model: User,
                    as: 'Followers', 
                    attributes: [ 'id' ],
                }]
            });

            res.status(200).json(fullUserWithoutPassword);
            
        }else{

            // 로그인안한 사용자일 경우 null
            res.status(200).json(null);
        }
        
    }catch(error){
        console.error(error);
        next(error);
    }
});


// async await 으로 만들어야함
// 안붙여도 데이터가 들어가기는 하는데,
// req.body를 쓰기전에 app.js에서 선행작업을 해야함
router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user/
    // 여기에 cookie가 있음
    console.log(req.headers);
    try{
        // 중복되는지 찾기
        // 비동기인지 아닌지모르겠으면 라이브러리 공식문서를 통해 확인할 것
        // 조건을 where안에 넣어야한다.
        const exUser = await User.findOne({
            where: { email: req.body.email }
        });
        // 없으면 null 임
        if(exUser){
            // 응답은 무조건 한번만 보내야하기에 return해서 라우터르 종료해야한다.
            // can't set headers already sent 에러메시지
            // 간단하게 상태코드와 데이터만 보내는것...
            // status 403은.... 금지의 의미
            // 200 성공 / 300 리다이렉트 / 400 클라이언트 에러 / 500 서버 에러
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        // 보안 (암호화/해쉬화)된 비번)
        // 10-13정도 숫자 2번째 인자로 전달, 높을수록 보안이 쎄짐.. 숫자가 너무 크면 서버가 느려짐...
        // 1초정도 걸리는 숫자로 맞추길
        const hashedPassword = await bcrypt.hash(req.body.password, 13);
        // 테이블에 데이터를 넣는데, await 붙여야함. 
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // CORS 해결
        // 차단은 브라우저가하지만 허용은 서버가 해야한다.
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
        // 또는 미들웨어 사용
        // 비동기로 작업이 되면 res.json이 먼저 실행되는 문제가 생길 수 있기에..(async, await을 써야함)
        // res.json(); // res.send('OK'); 로 작업해도됨.
        // 200으로해도되나 201은 잘 생성되었다는 좀 더 디테일한 값
        res.status(201).send('OK'); // status 생략가능하나 적는것을 추천 
    }catch(error){
        console.error(error);
        // next를 통해 에러를 보낼수있다.
        // next를 통해 에러를 보내면 한번에 처리함.(?)
        next(error); // status 500, 이건 서버에서 에러나는것이니까
    }
});

// 위의 함수를 미들웨어 확장하는 방법으로 변경하여 next에 에러를 전달하도록 수정
// 미들웨어를 확장하는 방식
router.post('/login', isNotLoggedIn, (req, res, next) => { // /user/login
    // isNotLoggedIn을 해당 함수 안에서 작업해도 되나
    // 중복되는 코드들이 생기기 때문에 커스텀으로 생성함
    
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            // 403은 금지라는 의미.
            // 401은 허가되지않음
            return res.status(401).send(info.reason);
        }
        // 이게 로그인하는것
        // loginErr는 패스포트에서 에러나는것
        return req.login(user, async (loginErr) => {
            if(loginErr){
                console.error(loginErr);
                return next(loginErr);
            }

            // 여기서 데이터 가공하기위해 정보를 찾아온다.
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                // 이렇게 하면 원하는 것만 뽑아서 가져올 수 있다.
                // attributes: [ 'id', 'nickname', 'email'],

                // 이렇게 하면 원하지 않는 것만 제외하고 가져올 수 있다.
                attributes: {
                    exclude: [ 'password' ]
                },
                
                // hasMany라서 model: Post가 복수형이 되어 me.Posts가 된다.
                // models/Post/ 에서 associate 확인, as썻으면 똑같이 as써야함
                // sequelize가 자동으로 합쳐주는것 지원
                include: [{ 
                    model: Post,
                    attributes: [ 'id' ],
                },{ 
                    model: User,
                    as: 'Followings',
                    attributes: [ 'id' ],
                },{ 
                    model: User,
                    as: 'Followers', 
                    attributes: [ 'id' ],
                }]
            });

            // 사용자 정보를 프론트로
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
    // 로그인한 정보
    // 보통 게시글, 댓글쓸때 정보쓸 수 있음
    req.logout();
    req.session.destroy();
    res.send('OK');
});

router.patch('/nickname', isLoggedIn, async(req, res, next) => {
    try{    
        await User.update({
            nickname: req.body.nickname,
        },{
            where: { id: req.user.id },
        });

        res.status(200).json({ nickname: req.body.nickname });

    }catch(error){
        console.error(error);
        next(error);
    }
});

// 라우터가 있는데 왜 404가 뜰까
// 미들웨어는 위에서 아래로, 왼쪽에서 오른쪽으로 찾는다.
// 상단에 /:userId 라우터가 있는데,
// 여기서 호출 시 followers같은 키워드를 userId로 인식해버린다.. => 에러가난다.! 황당!!
// params를 와일드카드라고 부르는데, 이런 params는 가장 아래로 내려두는게 좋다...
router.get('/followers', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.user.id }});
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요?')
        }

        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.user.id }});
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요?')
        }

        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10),
        });
        
        res.status(200).json(followings);

    }catch(error){
        console.error(error);
        next(error);
    }
});

// 차단
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.params.userId }});

        if(!user){
            res.status(403).send('없는 사람은 차단할 수 없습니다.');
        }

        await user.removeFollowings(req.user.id);
        
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }catch(error){
        console.error(error);
        next(error);
    }
});

// 특정 유저 정보 가져오기
router.get('/:userId', async (req, res, next) => {
    try{
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: [ 'password' ]
            },
            include: [{ 
                model: Post ,
                attributes: [ 'id' ],
            },{ 
                model: User,
                as: 'Followings',
                attributes: [ 'id' ],
            },{ 
                model: User,
                as: 'Followers', 
                attributes: [ 'id' ],
            }]
        });

        if(fullUserWithoutPassword){
            // squelize데이터 json으로 변환(가공하려면 해야함)
            const data = fullUserWithoutPassword.toJSON();
            
            // 개인정보 침해 예방
            data.Posts = data.Posts.length;
            data.Followers = data.Posts.length;
            data.Followings = data.Posts.length;

            res.status(200).json(data);
        }else{
            res.status(404).send('존재하지않는 사용자입니다.');
        }
        
    }catch(error){
        console.error(error);
        next(error);
    }
});

// 특정 사용자 게시글 가져오기
router.get('/:userId/posts', async (req, res, next) => { 
    try{
        const where = { UserId: rea.params.userId };

        if(parseInt(req.query.lastId, 10)){ 
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        }

        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                [ 'createdAt', 'DESC' ],
                [Comment, 'createdAt', 'DESC' ],
            ],
            include: [{
                model: User,
                attributes: [ 'id', 'nickname' ],
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: [ 'id', 'nickname' ],
                }],
            },{
                model: User,
                as: 'Likers',
                attributes: [ 'id' ],
            },{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: [ 'id', 'nickname' ],
                },{
                    model: Image,
                }]
            },],
        });

        res.status(200).json(posts);

    }catch(error){
        console.error(error);
        next(error);
    }
});

// 팔로우
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try{

        const user = await User.findOne({ where: { id: req.params.userId }});

        if(!user){
            res.status(403).send('없는 사람은 팔로우할 수 없습니다.');
        }

        await user.addFollowers(req.user.id);
        
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }catch(error){
        console.error(error);
        next(error);
    }
});

// 언팔로우
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.params.userId }});

        if(!user){
            res.status(403).send('없는 사람은 언팔로우할 수 없습니다.');
        }

        await user.removeFollowers(req.user.id);
        
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;