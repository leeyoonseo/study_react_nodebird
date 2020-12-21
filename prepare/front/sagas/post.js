import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

import shortId from 'shortid';

import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,

} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function addPostAPI(data){
    return axios.post('/api/post', data);
}

function* addPost(action){
    // user-post reducer에서 직접적 통신이 불가능? 힘드니
    // user reducer는 post saga에서 조작가능하니 여기서 작업
    try{
        const id = shortId.generate();
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        
        yield put({
            type: ADD_POST_SUCCESS,
            data: {
                id,
                content: action.data,
            }
        });

        yield put({
            type: ADD_POST_TO_ME,
            data: id,
        })

    } catch(err){
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function removePostAPI(data){
    return axios.delete('/api/post', data);
}

function* removePost(action){
    // user-post reducer에서 직접적 통신이 불가능? 힘드니
    // user reducer는 post saga에서 조작가능하니 여기서 작업
    try{
        const id = shortId.generate();
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        
        // post, user reducer를 한방에 바꿀수 없어서 put 두번
        // post reducer 상태
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });

        // user reducer 상태
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        })

    } catch(err){
        yield put({
            type: REMOVE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function addCommentAPI(data){
    return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addComment(action){
    try{
        // const result = yield call(addCommentAPI, action.data);
        
        yield delay(1000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: action.data,
        });

    } catch(err){
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchAddPost(){
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost(){
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment(){
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga(){
    yield all([
        fork(watchAddPost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ]);
}