import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

// 중복되는 주소를 baseURL로 작성하면 기본으로 axios가 적용해줌
axios.defaults.baseURL = 'http://localhost:3065';

// cors 문제 해결, 백엔드-프론트 둘 다 작업해야함
// 이렇게 한번등록하면 saga에서 요청하는 axios 요청들에서는 baseURL에는 다 공통적으로 들어감.
// https://www.zerocho.com/category/NodeJS/post/5e9bf5b18dcb9c001f36b275
// 하지만 이 모드 true일 경우에는 보안때문에 origin *하면안됨 정확한 주소적어야함
axios.defaults.withCredentials = true;

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
}
