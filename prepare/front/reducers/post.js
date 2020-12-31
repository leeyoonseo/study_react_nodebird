// 랜덤하게 id 생성하는 라이브러리로 
// 실무에서 id 생성이 애매할 경우에도 사용할수있다.
import shortId from 'shortid';

// immer
// 불변성 지옥에서 구원할지다.
// 다른 스타일로 코딩해보기 https://immerjs.github.io/immer/docs/curried-produce
import produce from 'immer';

// faker : 가짜 더미 데이터
import faker from 'faker';

export const initialState = {
    mainPosts: [],
    imagePaths: [],
    hasMorePosts: true,
    likePostLoading: false,
    likePostDone: false,
    likePostError: null,
    unlikePostLoading: false,
    unlikePostDone: false,
    unlikePostError: null,
    loadPostsLoading: false,
    loadPostsDone: false,
    loadPostsError: null,
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

// faker를 이용한 dummydata
// 성능최적화 테스트할때 몇 천개 작업해볼 것
export const generateDummyPost = (number) => Array(20).fill().map(() => ({
    id: shortId.generate(),
    User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
    },
    content: faker.lorem.paragraph(),
    // dummy 이미지 같이 크기만큼 공간을 차지하고 싶으면
    // placeholder.com을 사용하면 좋다.
    // lorempixel.com도 있다.
    Images: [{
        src: faker.image.image(),
    }],
    Comments: [{
        User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
        },
        content: faker.lorem.sentence(),
    }],
}));

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const addPost = (data) => ({
    type : ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type : ADD_COMMENT_REQUEST,
    data,
});

// 데이터 흐름에 유의할 것
// request -> saga -> reducer -> success -> view -> useEffect...
const reducer = (state = initialState, action) => produce(state, (draft) =>{
    switch(action.type){
        case UNLIKE_POST_REQUEST: 
            draft.unlikePostLoading = true;
            draft.unlikePostDone = false;
            draft.unlikePostError = null;   
            break;            
            
        case UNLIKE_POST_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId );
            post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
            draft.unlikePostLoading = false;
            draft.unlikePostDone = true;
            break;
        }

        case UNLIKE_POST_FAILURE:
            draft.unlikePostLoading = false;
            draft.unlikePostError = action.error;
            break;

        case LIKE_POST_REQUEST: 
            draft.likePostLoading = true;
            draft.likePostDone = false;
            draft.likePostError = null;   
            break;            
            
        case LIKE_POST_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId );
            post.Likers.push({ id: action.data.UserId });
            draft.likePostLoading = false;
            draft.likePostDone = true;
            break;
        }

        case LIKE_POST_FAILURE:
            draft.likePostLoading = false;
            draft.likePostError = action.error;
            break;

        case LOAD_POSTS_REQUEST:
            draft.loadPostsLoading = true;
            draft.loadPostsDone = false;
            draft.loadPostsError = null;   
            break;        

        case LOAD_POSTS_SUCCESS: {
            draft.mainPosts = action.data.concat(draft.mainPosts);
            draft.loadPostsLoading = false;
            draft.loadPostsDone = true;
            draft.hasMorePosts = draft.mainPosts.length < 50;
            break;
        }
            
        case LOAD_POSTS_FAILURE:
            draft.loadPostsLoading = false;
            draft.loadPostsError = action.error;
            break;

        case ADD_POST_REQUEST:
            draft.addPostLoading = true;
            draft.addPostDone = false;
            draft.addPostError = null;   
            break;        

        case ADD_POST_SUCCESS:
            draft.mainPosts.unshift(action.data);
            draft.addPostLoading = false;
            draft.addPostDone = true;
            break;

        case ADD_POST_FAILURE:
            draft.addPostLoading = false;
            draft.addPostError = action.error;
            break;

        case REMOVE_POST_REQUEST: 
            draft.removePostLoading = true;
            draft.removePostDone = false;
            draft.removePostError = null;                
            break;
            
        case REMOVE_POST_SUCCESS:
            draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
            draft.removePostLoading = false;
            draft.removePostDone = true;
            break;

        case REMOVE_POST_FAILURE:
            draft.removePostLoading = false;
            draft.removePostError = action.error;
            break;

        case ADD_COMMENT_REQUEST: 
            draft.addCommentLoading = true;
            draft.addCommentDone = false;
            draft.addCommentError = null;    
            break;            
            
        case ADD_COMMENT_SUCCESS: {
            const post = drafactiont.mainPosts.find((v) => v.id === action.data.PostId);
            post.Comments.unshift(action.data);
            draft.addCommentLoading = false;
            draft.addCommentDone = true;
            break;
        }

        case ADD_COMMENT_FAILURE:
            draft.addCommentLoading = false;
            draft.addCommentError = action.error;
            break;        
    }
});

export default reducer;