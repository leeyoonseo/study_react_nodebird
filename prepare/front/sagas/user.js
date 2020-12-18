// 보통 파일은 reducer와 비슷한 기준으로 쪼개면됨
import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

function loginAPI(data){
    return axios.post('/api/login', data);
}

function* login(action){
    try{
        // const result = yield call(loginAPI, action.data);

        // 아직서버가 없어서 에러가 날수도 있으므로 가짜로 작업해보겠음..
        yield delay(1000);
        // const result = yield loginAPI(action.data);

        yield put({
            type: 'LOG_IN_SUCCESS',
            data: action.data,
        });

    } catch(err){
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data,
        });
    }
}

function logoutAPI(){
    return axios.post('/api/logout');
}

function* logout(){
    try{
        const result = yield call(logoutAPI);
        yield put({
            type: 'LOG_OUT_SUCCESS',
            data: result.data,
        });

    } catch(err){
        yield put({
            type: 'LOG_OUT_FAILURE',
            data: err.response.data,
        });
    }
}

function* watchLogIn(){
    yield takeLatest('LOG_IN_REQUEST', login);
}

function* watchLogout(){
    yield takeLatest('LOG_OUT_REQUEST', logout);
}

export default function* userSaga(){
    yield all([
        fork(watchLogIn),
        fork(watchLogout),
    ]);
}
