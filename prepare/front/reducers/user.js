export const initialState = {
    logInLoading: false, // 로그인 시도중
    logInDone: false,
    logInError: null,
    logOutLoading: false, // 로그아웃 시도중
    logOutDone: false,
    logOutError: null,
    signUpLoading: false, // 로그아웃 시도중
    signUpDone: false,
    signUpFailure: null,
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

// 너무 길어지면 분리해도됨
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';


// success와 failure액션은 saga가 호출하기 때문에 우리가 액션을 만들 필요는 없다
export const loginRequestAction = (data) => {
    return{
        type: LOG_IN_REQUEST,
        data,
    }
};

export const logoutRequestAction = () => {
    return{
        type: LOG_OUT_REQUEST,
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOG_IN_REQUEST:
            return{
                ...state,
                logInLoading: true,
                logInError: null,
                logInDone: false,
            };
        case LOG_IN_SUCCESS: 
            return{
                ...state,
                logInLoading: false,
                logInDone: true,
                me: dummyUser(action.data),
            };
        case LOG_IN_FAILURE: 
            return{
                ...state,
                logInLoading: false,
                logInError: action.error,
            };
        case LOG_OUT_REQUEST: 
            return{
                ...state,
                logOutLoading: true,
                logOutDone: false,
                logOutError: null,
            };
        case LOG_OUT_SUCCESS:
            return{
                ...state,
                logOutLoading: false,
                logOutDone: true,
                me: null,
            };
        case LOG_OUT_FAILURE:
            return{
                ...state,
                logOutLoading: false,
                logOutError: action.error,
            };
        case SIGN_UP_REQUEST: 
            return{
                ...state,
                signUpLoading: true,
                signUpDone: false,
                signUpError: null,
            };
        case SIGN_UP_SUCCESS:
            return{
                ...state,
                signUpLoading: false,
                signUpDone: true,
            };
        case SIGN_U:
            return{
                ...state,
                signUpLoading: false,
                signUpError: action.error,
            };
        default: 
            return state;
    }
};

export default reducer; 
