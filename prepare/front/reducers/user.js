export const initialState = {
    isLoggingIn: false, // 로그인 시도중
    isLoggingOut: false, // 로그아웃 시도중
    isLoggedIn: false,
    me: null,
    signUpData: {},
    loginData: {},
};

export const loginAction = (data) => {
    return (dispatch, getState) => {

        const state = getState();

        dispatch(loginRequestAction());

        axios.post('/api/login')
            .then((res) => {
                dispatch(loginRequestAction(res.data));
            })
            .catch((err) => {
                dispatch(loginFailureAction(err));
            });
    }
}

// success와 failure액션은 saga가 호출하기 때문에 우리가 액션을 만들 필요는 없다
export const loginRequestAction = (data) => {
    return{
        type: 'LOG_IN_REQUEST',
        data
    }
};

export const logoutRequestAction = () => {
    return{
        type: 'LOG_OUT_REQUEST',
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOG_IN_REQUEST': 
            return{
                ...state,
                isLoggingIn: false,
            };
        case 'LOG_IN_SUCCESS': 
            return{
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
                me: { 
                    ...action.data, 
                    nickname: 'okayoon' 
                },
            };
        case 'LOG_IN_FAILURE': 
            return{
                ...state,
                isLoggingIn: false,
                isLoggedIn: false,
                me: action.data,
            };
        case 'LOG_OUT_REQUEST': 
            return{
                ...state,
                isLoggingOut: true,
            };
        case 'LOG_OUT_SUCCESS': 
            return{
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                me: null,
            };
        case 'LOG_OUT_FAILURE': 
            return{
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                me: null,
            };
        default: 
            return state;
    }
};

export default reducer; 
