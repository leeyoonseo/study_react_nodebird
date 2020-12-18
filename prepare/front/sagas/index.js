// saga에는 generator가 나온다.
// 문법이 generator...
// 그래도 generator를 어느정도 이해해야한다.

// Generator란?
// 

// saga 이펙트
// all은 한방에
// fork는 함수를 실행한다는 뜻
// call은 fork대신쓸수 있는데, 차이를 알고 넘어가자
// fork와 call은 함수 실행할수 있다 둘의 차이는...
// fork는 비동기함수호출
// 요청보내고 다음 함수 실행(논 블로킹)
// call은 동기함수호출
// call을 하면 리턴할때까지 기다림

// 그외 다양한 이펙트들이 존재함
// delay, debounce, throttle, akeLatest, takeLeading..
import { all, fork, call, put, take } from 'redux-saga/effects';
import axios from 'axios';

// 이건 제너레이터가 아님!!
function loginAPI(data){
    return axios.post('/api/login', data);
}

// 보통이렇게 많이쓴다함
// login request할때 data는 여기에 action으로 들어옴
// action.type, action.data..
function* login(action){
    // 요청 실패 대비
    try{
        // 비동기 요청 결과를 받아서
        // 처리해야할때는 call!!!!! (동기이기때문)
        // 데이터 여기에 2번째 인수로 전달!!
        // 인수를 여러개 넘길수도있다. 
        const result = yield call(loginAPI, action.data);

        // yield 붙이는 이유는 테스트 코드짜고 사용할때 유용
        // 아래와 같이 써도되는데 call 이펙트를쓰는이유?
        // const result = yield loginAPI(action.data);

        // 항상 이펙트 앞에는 yield!
        // yield는 await과 비슷한데
        // fork할때는 await을 안한것과 같다..(비동기임)
        yield put({
            type: 'LOG_IN_SUCCESS',
            data: result.data,
        });

    // put은 dispatch라고 생각하면됨.
    } catch(err){
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data,
        });
    }
}

// 테스트 코드 사용 예시.. 한줄씩 돌려보면서 테스트할 수 있다.
// const l = lgin({ type: 'LOG_IN_REQUEST', data: { id: 'zero' }}); 
// l.next(); 
// l.next();


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

function addPostAPI(data){
    return axios.post('/api/addPost', data);
}

function* addPost(action){
    try{
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: 'ADD_POST_SUCCESS',
            data: result.data,
        });

    } catch(err){
        yield put({
            type: 'ADD_POST_FAILURE',
            data: err.response.data,
        });
    }
}

// 비동기 액션 크리에이터.. 이벤트리스너 같은 역할
function* watchLogin(){
    // login 액션을 실행할때까지 기다리겠다.
    // login 액션이 실행되면 login 함수를 실행한다.
    yield take('LOG_IN_REQUEST', login);
}

function* watchLogout(){
    yield take('LOG_OUT_REQUEST', logout);
}

function* watchAddPost(){
    yield take('ADD_POST_REQUEST', addPost);
}

// root saga만들고 사용하고 싶은 비동기 액션들을 하나씩 넣어준다..
export default function* rootSaga(){
    // all은 한번에 다 실행시킴
    yield all([
        fork(watchLogin), // call
        fork(watchLogout),
        fork(watchAddPost),
    ]);
}

