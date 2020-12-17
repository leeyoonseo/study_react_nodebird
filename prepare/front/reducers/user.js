// user와 관련된 것들 다 가져오기

// 분리를 했기 때문에 나중에 합쳐줘야함
// 따라서 export 추가
export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpData: {},
    loginData: {},
};

// redux-thunk를 쓰면 함수를 리턴하는 하나의 비동기 액션이 추가됨
export const loginAction = (data) => {
    return (dispatch, getState) => {

        // getState실행하면 해당 파일의 initialState가 나오는게 아니라 
        // reducers/index.js의 initialState가 나옴
        const state = getState();

        // redux-thunk말고 redux-saga를 쓰는이유
        // 많은 기능이 구현되어있다.
        // 예를 들어 redux-thunk에서는 delay를 아래와 같이 구현해야한다.
        // setTimeout(() => {
        //     dispatch(loginRequestAction());
        // }, 2000);
        // 또한 실수로 클릭 2번했을 경우(요청이 2번갈경우)
        // thunk에서는 요청2번이 다 가고
        // saga는 take latest라는것이 있어서 마지막것만 요청으로 처리한다.
        // 쓰로틀 기능 제공(스로틀링은 기기가 지나친 과열때 손상을 막기위해 클럭과 전압 강제로 낮추거나 전원을꺼서...) 
        // 예시로 스크롤 이벤트에 비동기 요청이 있을 경우 saga는 알아서 처리한다.
        // => 만약 처리를 안해주면 디도스공격(서비스거부공격, denial-of-service attack)이 될것이다..
        // 프론트 개발 시 이런 사태를 만들면... 자기서버에 디도스공격을하는...
        // 실력있는 개발자가 되기위해... 최악이되지말자..!!
        // 스로틀과 디바운스로 1초에 몇번처리해준다. 만약 몇번이 넘어가면 차단한다 처리를 해야함
        // thunk로는 부족해서 saga가 이러한 기능들을 구현해뒀기 때문에 복잡할 경우 saga를 사용한다. 
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

export const loginRequestAction = (data) => {
    return{
        type: 'LOG_IN_REQUEST',
        data
    }
};

// 성공, 실패 dispatch 액션은 넣을지말지 본인이 알아서 하는것임..
// 하지만 기본적으로 ㅎ.. 3개의 단계로 나눌 수 있다.
export const loginSuccessAction = (data) => {
    return{
        type: 'LOG_IN_SUCCESS',
        data
    }
};

export const loginFailureAction = (data) => {
    return{
        type: 'LOG_IN_FAILURE',
        data
    }
};

export const logoutRequestAction = () => {
    return{
        type: 'LOG_OUT_REQUEST',
    }
};

export const logoutSuccessAction = (data) => {
    return{
        type: 'LOG_OUT_SUCCESS',
        data
    }
};

export const logoutFailureAction = (data) => {
    return{
        type: 'LOG_OUT_FAILURE',
        data
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOG_IN': 
            return{
                ...state,
                isLoggedIn: true,
                me: action.data,
            };
        case 'LOG_OUT': 
            return{
                ...state,
                isLoggedIn: false,
                me: null,
            };
        default: 
            return state;
    }
};

export default reducer; 
