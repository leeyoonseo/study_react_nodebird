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

// redux-thunk
// redux-thunk가 필요한 이유는?
// redux-saga 쓸거고 실무에서 쓸건데....
// login, logout 액션때.. 기능 동작 시 바로 되지 않음
// 백엔드에 요청-응답이 필요한데...
// (요청,실패,성공의 액션이 총 3개 필요함..)
import thunkMiddleware from 'redux-thunk';

// redux-thunk 커스텀 예시
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    // function 일 경우 지연함수
    // if (typeof action === 'function') {
    //     return action(dispatch, getState, extraArgument);
    // }
    
    // 액션 실행전 작업
    // ....

    // 액션 실행
    return next(action);
}

const configureStore = () => {
    // redux-thunk 미들웨어 추가 예시
    // devtool 같은 경우도 devtool 미들웨어가 장착되어져서 가능한 부분임.
    const middlewares = [thunkMiddleware, loggerMiddleware];
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