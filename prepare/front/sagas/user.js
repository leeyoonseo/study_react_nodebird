// 보통 파일은 reducer와 비슷한 기준으로 쪼개면됨
import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

import { 
    LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, 
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, 
} from '../reducers/user';

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
            type: LOG_IN_SUCCESS,
            data: action.data,
        });

    } catch(err){
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
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
            type: LOG_OUT_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}


function signUpAPI(){
    return axios.post('/api/signUp');
}

function* signUp(){
    try{
        // const result = yield call(signUpAPI);
        yield delay(1000);
        // 만약 throw new Error('')를 쓴다면 catch문 실행됨
        // throw new Error('');
        yield put({
            type: SIGN_UP_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLogIn(){
    yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogout(){
    yield takeLatest(LOG_OUT_REQUEST, logout);
}

function* watchSignUp(){
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga(){
    yield all([
        fork(watchLogIn),
        fork(watchLogout),
        fork(watchSignUp),
    ]);
}
