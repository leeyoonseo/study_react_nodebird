const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {

    // serializeUser, deserializeUser 설정이 있다.
    // req.login이 실행되면 serializeUser가 실행됨
    passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
        // 쿠키랑 묶어줄 1번만 저장하는것(토큰?)
        // 세션에 다 들고 있기 무거우니 유저아이디만 들고있다가.
        // 아래 db에서 유저 아이디를 통해 정보 가져오는것..  
        done(null, user.id);
    });


    // 이건 db에서
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ where: { id }});
            done(null, user); // req.user
        } catch (error) {
            console.error(error);
            done(error);
        }
    });

    // local에서 작업한 것들 실행
    local();
};

// 프론트에서 서버로는 cookie만 보내요(clhxy)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// id: 1이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱
