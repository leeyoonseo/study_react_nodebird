import { all, fork, call, put, takeLatest, delay, throttle } from 'redux-saga/effects';
import axios from 'axios';

import {
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, 
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,

} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function loadPostsAPI(data){
    return axios.get('/posts', data);
}

function* loadPosts(action){
    try{
        const result = yield call(loadPostsAPI, action.data);
        
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data,
        });
    } catch(err){
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data,
        });
    }
}

function addPostAPI(data){
    // formData는 data로 전달(json 형식X)
    return axios.post('/post', data);
}

function* addPost(action){
    try{
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });

        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        })

    } catch(err){
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function removePostAPI(data){
    // delete는 데이터 못 넣음
    return axios.delete(`/post/${data}`);
}

function* removePost(action){
    try{
        const result = yield call(removePostAPI, action.data);
        
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });

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
    // 주소는 약속... 아무렇게나 만들어도되나 의미가있는게 보통
    // 따라서 id를 사용해서 작업
    return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action){
    try{
        const result = yield call(addCommentAPI, action.data);
        
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data,
        });
    }
}

function unlikePostAPI(data){
    // 일부분 수정이므로 patch 사용
    return axios.delete(`/post/${data}/like`);
    // 여러가지 방법이 있음, 약속에 따라 정할 것
    //return axios.patch(`/post/${data}/unlike`);
}

function* unlikePost(action){
    try{
        const result = yield call(unlikePostAPI, action.data);
        
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function likePostAPI(data){
    // 일부분 수정이므로 patch 사용
    return axios.patch(`/post/${data}/like`);
}

function* likePost(action){
    console.log('action', action.data);
    try{
        const result = yield call(likePostAPI, action.data);
        
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response.data,
        });
    }
}

function uploadImagesAPI(data){
    // formData는 감싸서 { name: data } json 형식으로 보내면 안됨`
    return axios.post('/post/images', data);
}

function* uploadImages(action){
    try{
        const result = yield call(uploadImagesAPI, action.data);
        
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });

    } catch(err){
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data,
        });
    }
}


function* watchLoadPosts(){
    // throttle로 scroll 이벤트 여러번 방지
    // throttle이 5초를 지켜주지만, 기존 요청을 취소하지않음
    // 5초 뒤 하나가 더 성공하는 문제가 생김
    // 요청을 한번만 보낼수는없을까? loadPostsLoading을 이용하자.
    yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
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

function* watchUnlikePost(){
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLikePost(){
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUploadImages(){
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

export default function* postSaga(){
    yield all([
        fork(watchUploadImages),
        fork(watchUnlikePost),
        fork(watchLikePost),
        fork(watchAddPost),
        fork(watchLoadPosts),
        fork(watchRemovePost),
        fork(watchAddComment),
    ]);
}


// TODO
// 1. react-virtualized 사용해보기