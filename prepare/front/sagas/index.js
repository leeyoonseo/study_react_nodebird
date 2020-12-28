import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import userSaga from './user';
import postSaga from './post';

// 중복되는 주소를 baseURL로 작성하면 기본으로 axios가 적용해줌
axios.defaults.baseURL = 'http://localhost:3065';

export default function* rootSaga(){
    yield all([
        fork(userSaga),
        fork(postSaga),
    ]);
}