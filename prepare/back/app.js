// http 서버 실행
const express = require('express');

// 한번 호출해야함
const app = express();

// method, url
// 주소창에 입력은 get 요청임
app.get('/', (req, res) => {
    res.send('hellow express');
});

app.get('/api', (req, res) => {
    res.send('hellow api');
});

app.get('/api/posts', (req, res) => {
    // 게시글, 데이터는 보통 json임
    // json 객체를 응답할 수 있다.
    res.json([
        { id: 1, content: 'hello1'},
        { id: 2, content: 'hello2'},
        { id: 3, content: 'hello3'},
    ]);
});

// front에서 axios나 postman을 통해 post, delete 요청을 보낸다.
app.post('/api/post', (req, res) => {
    res.json({ id: 1, content: 'hello'});
});

// 협의 후 api uri 정함
// 아무렇게나 지으면 모르니까 보통 RestAPI 방식으로 많이 짓는다.
// !! 자주쓰는 것들
// app.get -> 가져오다(게시글/사용자정보)
// app.post -> 생성하다(등록 시)
// app.put -> 전체 수정
// app.patch -> 부분 수정
// app.put, app.patch 수정 차이... 사용자 닉네임, 컨텐츠등은 patch 통째로 덮여씌울때 put, 즉 put사용빈도가 더 낮다
// app.delete -> 제거
// app.options -> 찔러보기(나 요청보낼수있니?? 서버야?)
// app.head -> 예제에서는 안씀 (헤더만 가져와사용할때, 헤더/바디가있다.) - 헤더는 보통 바디에대한 정보.. 통신정보, 데이터 타입 정보, 용량 등등..
// 하지만 다 합의로 결정한다. post로 메인페이지를 가져올수도있다.
// 모르겠고 애매하면 post 쓰삼.
// 팀원끼리 타협보삼. Rest지키기 힘들어서 타협봄..
app.delete('/api/post', (req, res) => {
    res.json({ id: 1 });
});

// !! back에서 작업하고나서는 서버 내리고 올려야함 node app.js! 
app.listen(3065, () => {
    console.log('서버 실행 중...');
});