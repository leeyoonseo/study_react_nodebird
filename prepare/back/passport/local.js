const passport = require('passport');
// 구조분해할당에서 strategy의 이름을 LocalStrategy로 변경한 것임
// 나중에 많이 생길것 대비
const { Strategy: LocalStrategy} = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// index.js에서 local()에서 실행됨
module.exports = () => {

    // req.body가 들어오므로... 그에 대한 설정 
    passport.use(new LocalStrategy({
        usernameField: 'email', // id
        passwordField: 'password', // password

    // 여기서 로그인 전략을 세우면 됨
    }, async(email, password, done) => {
        // 비동기는 서버에러 발생가능서이 있으므로
        // try, catch
        try{
            const user = await User.findOne({
                where: { email },
            });
    
            if(!user){
                // 순서
                // 서버에러, 성공, 클라이언트 에러
                return done(null, false, { reason: '존재하지 않는 이메일입니다.' });
            }
    
            // 비밀번호 비교
            const result = await bcrypt.compare(password, user.password);
            
            if(result){
                // 두번째 자리가 성공
                return done(null, user);
            }
    
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        }catch(error){
            console.error(error);
            return done(error);
        }
        
    }));
};