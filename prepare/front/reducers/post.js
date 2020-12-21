// 랜덤하게 id 생성하는 라이브러리로 
// 실무에서 id 생성이 애매할 경우에도 사용할수있다.
import shortId from 'shortid';

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '오키',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레스',
        Images: [{
            id: shortId.generate(),
            src: 'https://newsimg.hankookilbo.com/cms/articlerelease/2019/04/29/201904291390027161_3.jpg'
        }, {
            id: shortId.generate(),
            src: 'http://www.animaltogether.com/news/photo/202007/1913_4321_523.jpg'
        }, {
            id: shortId.generate(),
            src: 'https://kr.theepochtimes.com/assets/uploads/2020/07/d6jdut6bi6k41-795x436.jpg'
        }, {
            id: shortId.generate(),
            src: 'https://i.fltcdn.net/contents/954/original_1420186568382_ixqg3zq6w29.jpeg'
        }],
        // 대문자(서버에서 주는 애들)들은 id가 있어야함
        Comments: [{
            id: shortId.generate(),
            User: {
                id: shortId.generate(),
                nickname:'와우'
            },
            content: '새로운 것이다~',
        },{
            id: shortId.generate(),
            User: {
                id: shortId.generate(),
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

    removePostLoading: false,
    removePostDone: false,
    removePostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
    id: data.id,
    content: data.content,
    User: {
        id: 1,
        nickname: 'okayoon',
    },
    Images: [],
    Comments: [],
});

const dummyComment = (data) => ({
    id: shortId.generate(),
    content: data,
    User: {
        id: 1,
        nickname: 'okayoon'
    }
});

// 흐름에 유의할 것
// request -> saga -> reducer -> success -> view -> useEffect...

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
                mainPosts: [
                    dummyPost(action.data), 
                    ...state.mainPosts
                ],
                addPostLoading: false,
                addPostDone: true,
            };
        case ADD_POST_FAILURE:
            return{
                ...state,
                addPostLoading: false,
                addPostError: action.error,
            };
        case REMOVE_POST_REQUEST: 
            return{
                ...state,
                removePostLoading: true,
                removePostDone: false,
                removePostError: null,                
            };
        case REMOVE_POST_SUCCESS:
            return{
                ...state,
                mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
                removePostLoading: false,
                removePostDone: true,
            };
        case REMOVE_POST_FAILURE:
            return{
                ...state,
                removePostLoading: false,
                removePostError: action.error,
            };
        case ADD_COMMENT_REQUEST: 
            return{
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null,                
            };
        case ADD_COMMENT_SUCCESS: {
            // 불변성을 유지하기 위해서...ㅠㅠ
            // 이것을 편하게 하기위한 라이브러리가있다. 이머?
            const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            const Comments = [
                dummyComment(action.data.content),
                ...post.Comments
            ];
            const mainPosts = [ ...state.mainPosts ];
            mainPosts[postIndex] = {
                ...post,
                Comments
            };

            return{
                ...state,
                mainPosts,
                addCommentLoading: false,
                addCommentDone: true,
            };
        }
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
