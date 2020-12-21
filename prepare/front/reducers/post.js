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

export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
});

const dummyPost = (data) => ({
    id: shortId.generate(),
    content: data,
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
