// store 설정을 하는 store js를 만든다.
// 이게 기본 셋팅
import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux'; 

// 리덕스 실제 구현하기
import reducer from '../reducers';

const configureStore = () => {
    // store 만들기
    // store는 state와 reducer를 포함하는것
    const store = createStore(reducer);
    
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