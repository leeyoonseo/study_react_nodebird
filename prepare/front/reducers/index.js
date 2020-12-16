// 액션이라는데?
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

// user, post로 나눈 리듀서들 합쳐줘야함
import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태
// combineReducers는 리듀서 합쳐주는 메서드
// 근데 왜 쉽게 못 합치냐면 리듀서가 함수이기때문에
const rootReducer = combineReducers({
    // HYDRATE를 위해서 index 리듀서를 추가한 것
    index: (state = {}, action) => {
        switch(action.type){
            case HYDRATE: 
                return{ ...state, ...action.payload }
            
            // npm run dev했을때 reducer에서 return undefined during initialization이라는 에러가나면 default를 처리해줘야한다.
            // 액션, 타입, 다음 상태를 만들때 reducer 초기화시 swith문이 실행되는데
            // 이때 default가 없으면 undefined가 되기때문에 에러가 난다. 
            default:
                return state;
        }
    },
    user,
    post,
});

export default rootReducer;