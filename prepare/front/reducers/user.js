// user와 관련된 것들 다 가져오기

// 분리를 했기 때문에 나중에 합쳐줘야함
// 따라서 export 추가
export const initialState = {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
};

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

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOG_IN': 
            return{
                ...state,
                isLoggedIn: true,
                user: action.data,
            };
        case 'LOG_OUT': 
            return{
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default: 
            return state;
    }
};

export default reducer; 
