const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    // serializeUser, deserializeUser 설정이 있다.
    // req.login이 실행되면 serializeUser가 실행됨
    passport.serializeUser((user, done) => {
        // 쿠키랑 묶어줄 1번만 저장하는것(토큰?)
        // 세션에 다 들고 있기 무거우니 유저아이디만 들고있다가.
        // 아래 db에서 유저 아이디를 통해 정보 가져오는것..
        done(null, user.id);
    });

    // 이건 db에서
    passport.deserializeUser(async (id, done) => {
        try{
            const user = await User.findOne({ where: { id } });
            done(null, user);
        }catch(error){
            console.error(error);
            done(error);
        }
    });

    // local에서 작업한 것들 실행
    local();
};