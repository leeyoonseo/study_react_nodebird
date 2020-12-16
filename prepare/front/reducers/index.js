// 액션이라는데?
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    // 모든 데이터의 기본데이터 필요
    user: {
        isLoggedIn: false,
        user: null,
        signUpData: {},
        loginData: {},
    },
    post : {
        mainPosts: [],
    },
};

// action creator를 내보내서 import해서 써야함
export const loginAction = (data) => {
    return{
        type: 'LOG_IN',
        data
    }
};

export const logoutAction = () => {
    return{
        type: 'LOG_OUT',
    }
};

// action
// action은 객체, 기본 사용
//const changeNickname = {
//    type: 'CHANGE_NICKNAME',
//    data: 'oky',
//} 

// changeNickname을 여러개하고 싶을 경우 (타입이 같은 액션 다른 데이터)
// 중복된 것을 처리하기 위해 액션 생성기를 만든다
// action creator
const changeNickname = (data) => {
    return{
        type: 'CHANGE_NICKNAME',
        data,
    }
};
// 이런식으로 사용 -> store.dispatch(changeNickname('boogi'));

// async action creator도 뒤에 나옴.!

// (이전상태, 액션) => 다음상태
const rootReducer = (state = initialState, action) => {
    switch(action.type){
        // HYDRATE가 생겼는데
        // 서버사이드 렌더링이 기존과 달라져서 새로 생겼다는데?
        case HYDRATE: 
            return{ ...state, ...action.payload }
        case 'LOG_IN': 
            return{
                ...state,
                user: {
                    // 불변성 유지 필수
                    ...state.user,
                    isLoggedIn: true,
                    user: action.data,
                }
            };
        case 'LOG_OUT': 
            return{
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: false,
                    user: null,
                }
            };
        // npm run dev했을때 reducer에서 return undefined during initialization이라는 에러가나면 default를 처리해줘야한다.
        // 액션, 타입, 다음 상태를 만들때 reducer 초기화시 swith문이 실행되는데
        // 이때 default가 없으면 undefined가 되기때문에 에러가 난다. 
        default:
            return state;
    }
};

export default rootReducer;