const passport = require('passport');
const local = require('./local');


module.exports = () => {
    // serializeUser, deserializeUser 설정이 있다.
    passport.serializeUser(() => {

    });

    passport.deserializeUser(() => {

    });

    // local에서 작업한 것들 실행
    local();
};