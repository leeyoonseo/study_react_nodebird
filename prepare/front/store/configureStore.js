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

// redux-saga는 따로 작성해야하는게 있음
import rootSaga from '../sagas';

// redux-saga 사용하기
// next랑 연결하기 위해 next-redux-saga
import createSagaMiddleware from 'redux-saga';

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
    // redux-saga 추가
    const sagaMiddleware = createSagaMiddleware();
    
    // sagaMiddleware로 교체
    // sagaMiddleware는 몇가지 기능이 있음
    const middlewares = [sagaMiddleware, loggerMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));

    // store 만들기
    // store는 state와 reducer를 포함하는것
    const store = createStore(reducer, enhancer);
    
    // redux-saga
    // rootSagas는 작성해야하는게 있음
    store.sagaTask = sagaMiddleware.run(rootSaga);

    return store;
};

// 두번째 인자는 옵션 객체
const wrapper = createWrapper(configureStore, {
    // 디버그 부분이 트루일 경우 리덕스관련 자세한 설명이 나옴
    // 개발시에는 true로 두는게 편할 듯
    debug: process.env.NODE_ENV === 'development',
});

export default wrapper;