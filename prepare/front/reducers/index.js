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
    }
};

export default rootReducer;