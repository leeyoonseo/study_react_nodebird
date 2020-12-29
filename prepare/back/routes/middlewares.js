// 로그인했는지 안했는지 검사하는 미들웨어
// app.js에서 use로 사용하는애들은 미들웨어....

exports.isLoggedIn = (req, res, next) => {
    // passport에서 isAuthenticated 메서드 제공
    if(req.isAuthenticated()){
        // 여태 에러처리때 썼었으나...
        // 사용방법이 2가지가 있다.
        // 그냥 next치면 다음 미들웨어로 진행하고
        // next안에 에러처리하면 에러를 처리해준다.
        next();

    }else{

        // 왜 401이지??
        // 브라우저의 원리를 알아야한다!
        // 브라우저 - 백엔드 도메인이 달라서 cors문제가 생겼었는데,
        // 도메인이 다르면 쿠키도 전달이안됨....
        // 내가 로그인을 했다고해서 쿠키가 다르면 백엔드서버에 요청할 수 없음..
        res.status(401).send('로그인이 필요합니다.');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();

    }else{
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
};