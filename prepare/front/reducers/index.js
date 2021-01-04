// 액션이라는데?
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

// user, post로 나눈 리듀서들 합쳐줘야함
import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
    switch(action.type){
        case HYDRATE: 
        
            return action.payload;
        default: {
            const combinedReducer = combineReducers({
                user,
                post,                
            });
            return combinedReducer(state, action);
        }
    }
};

export default rootReducer;