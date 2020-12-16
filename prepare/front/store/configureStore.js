// store 설정을 하는 store js를 만든다.
// 이게 기본 셋팅
import { createWrapper } from 'next-redux-wrapper';

// action 기록하기(미들웨어)
// 개발용과 배포용이 다르기때문에 applyMiddleware, compose 추가
import { createStore, applyMiddleware, compose } from 'redux'; 

// 브라우저 개발자도구와 연동하기위한 작업
import { composeWithDevTools } from 'redux-devtools-extension';

// 리덕스 실제 구현하기
import reducer from '../reducers';

const configureStore = () => {
    // action 기록하기(미들웨어)
    // 개발용과 배포용 미들웨어가 다르기때문에. 
    // 개발일때는 composeWithDevTools을 써줘야함
    // 배포와 구분하는 것은 보안상 위험할 수 있기 때문
    // 사가나 성크?는 나중에 [] 배열안에 넣는다고한다.
    // 배열을 직접 넣으면 에러가 나므로...스프레드해서 넣는다
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));

    // store 만들기
    // store는 state와 reducer를 포함하는것
    const store = createStore(reducer, enhancer);
    
    // dispatch 방법 
    // dispatch하는 순간 reducer로 전달이 되서 state가 변경됨
    // store.dispatch({
    //     type: 'CHANGE_NICKNAME',
    //     data: 'oky',
    // });

    return store;
};

// 두번째 인자는 옵션 객체
const wrapper = createWrapper(configureStore, {
    // 디버그 부분이 트루일 경우 리덕스관련 자세한 설명이 나옴
    // 개발시에는 true로 두는게 편할 듯
    debug: process.env.NODE_ENV === 'development',
});

export default wrapper;