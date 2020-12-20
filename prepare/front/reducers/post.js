// User, Images, Comments만 대문자로 시작하는가?
// DB쪽에서 쓰는 시퀄라이즈와 연관이있다고한다.
// 어떤 정보나 다른 관계된것이 있으면 합쳐준다고하고
// 합쳐주면 대문자로 나온다고하는데, 이대로 유지해서 작업..
// id, content는 게시글 정보, 대문자는 합쳐진 정보
// 하지만 서버쪽 설정으로 소문자로 변경할 수도 있다
// 따라서 서버쪽 개발자에게 먼저 문의하는게 좋겠지?
export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '오키',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레스',
        Images: [{
            src: 'https://newsimg.hankookilbo.com/cms/articlerelease/2019/04/29/201904291390027161_3.jpg'
        }, {
            src: 'http://www.animaltogether.com/news/photo/202007/1913_4321_523.jpg'
        }, {
            src: 'https://kr.theepochtimes.com/assets/uploads/2020/07/d6jdut6bi6k41-795x436.jpg'
        }, {
            src: 'https://i.fltcdn.net/contents/954/original_1420186568382_ixqg3zq6w29.jpeg'
        }],
        Comments: [{
            User: {
                nickname:'와우'
            },
            content: '새로운 것이다~',
        },{
            User: {
                nickname:'그린뉴딜'
            },
            content: '기도메타중입니다..할레루야',
        }]
    }],
    // 이미지 저장 경로
    imagePaths: [],

    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_POST_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_POST_FAILURE';

// action을 그때그때 생성해주는 creator
export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = {
    id: 2,
    content: '더미데이터',
    User: {
        id: 1,
        nickname: '최초',
    },
    Images: [],
    Commnets: [],
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_POST_REQUEST: 
            return{
                ...state,
                addPostLoading: true,
                addPostDone: false,
                addPostError: null,                
            };
        case ADD_POST_SUCCESS:
            return{
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                addPostLoading: false,
                addPostDone: true,
            };
        case ADD_POST_FAILURE:
            return{
                ...state,
                addPostLoading: false,
                addPostError: action.error,
            };
        case ADD_COMMENT_REQUEST: 
            return{
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null,                
            };
        case ADD_COMMENT_SUCCESS:
            return{
                ...state,
                addCommentLoading: false,
                addCommentDone: true,
            };
        case ADD_COMMENT_FAILURE:
            return{
                ...state,
                addCommentLoading: false,
                addCommentError: action.error,
            };
        default: 
            return state;
    }
};


export default reducer; 
