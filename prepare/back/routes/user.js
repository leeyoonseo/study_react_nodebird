const express = require('express');

// 비밀번호 암호화
const bcrypt = require('bcrypt');

// db 만든거
const { User } = require('../models');
const router = express.Router();

// async await 으로 만들어야함
// 안붙여도 데이터가 들어가기는 하는데,
// req.body를 쓰기전에 app.js에서 선행작업을 해야함
router.post('/', async (req, res, next) => { // POST /user/

    // 비동기다본 에러가뭔지 알기위해 try, catch
    try{
        // 중복되는지 찾기
        // 비동기인지 아닌지모르겠으면 라이브러리 공식문서를 통해 확인할 것
        const exUser = await User.findOne({
            // 조건을 where안에 넣어야한다.
            where: {
                email: req.body.email,
            }
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

module.exports = router;