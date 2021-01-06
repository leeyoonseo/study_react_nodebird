// 랜덤하게 id 생성하는 라이브러리로 
// 실무에서 id 생성이 애매할 경우에도 사용할수있다.
import shortId from 'shortid';

// immer
// 불변성 지옥에서 구원할지다.
// 다른 스타일로 코딩해보기 https://immerjs.github.io/immer/docs/curried-produce
import produce from 'immer';

export const initialState = {
    mainPosts: [],
    imagePaths: [],
    singlePost: null,
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
    loadPostLoading: false,
    loadPostDone: false,
    loadPostError: null,
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    removePostLoading: false,
    removePostDone: false,
    removePostError: null,
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
    uploadImagesLoading: false,
    uploadImagesDone: false,
    uploadImagesError: null,
    retweetLoading: false,
    retweetDone: false,
    retweetError: null,
};

// LOAD_USER_POSTS_REQUEST
export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';


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

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

// 동기 액션은 하나만 만들어도됨
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

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
        case RETWEET_REQUEST: 
            draft.retweetLoading = true;
            draft.retweetDone = false;
            draft.retweetError = null;   
            break;            
            
        case RETWEET_SUCCESS: {
            draft.mainPosts.unshift(action.data);
            draft.retweetLoading = false;
            draft.retweetDone = true;
            break;
        }

        case RETWEET_FAILURE:
            draft.retweetLoading = false;
            draft.retweetError = action.error;
            break;


        // 만약에 서버에서 지울 경우에는 비동기로 만들어야함..
        case REMOVE_IMAGE:
            draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
            break;

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

        // 재사용할 수 있다!
        // 1) 한페이지에서 같이 사용하지 않을 경우 공유할 수 있다.
        case LOAD_USER_POSTS_REQUEST:
        case LOAD_HASHTAG_POSTS_REQUEST:
        case LOAD_POSTS_REQUEST:
            draft.loadPostsLoading = true;
            draft.loadPostsDone = false;
            draft.loadPostsError = null;   
            break;        

        case LOAD_USER_POSTS_SUCCESS:
        case LOAD_HASHTAG_POSTS_SUCCESS:
        case LOAD_POSTS_SUCCESS:
            draft.loadPostsLoading = false;
            draft.loadPostsDone = true;
            draft.mainPosts = draft.mainPosts.concat(action.data);

            // 1번의 요청낭비는 발생할 수 있다.
            // 10개가 안된다면 요청이 멈추는데, 10의 배수일 경우 요청 1번이 될 수있다.
            draft.hasMorePosts = action.data.length === 10;
            break;

        case LOAD_USER_POSTS_FAILURE:
        case LOAD_HASHTAG_POSTS_FAILURE:
        case LOAD_POST_FAILURE:
            draft.loadPostLoading = false;
            draft.loadPostError = action.error;
            break;

        case LOAD_POST_REQUEST:
            draft.loadPostLoading = true;
            draft.loadPostDone = false;
            draft.loadPostError = null;   
            break;        

        case LOAD_POST_SUCCESS: {
            draft.loadPostLoading = false;
            draft.loadPostDone = true;
            draft.singlePost = action.data;
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
            draft.imagePaths = [];
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
            draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
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
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Comments.unshift(action.data);
            draft.addCommentLoading = false;
            draft.addCommentDone = true;
            break;
        }

        case ADD_COMMENT_FAILURE:
            draft.addCommentLoading = false;
            draft.addCommentError = action.error;
            break;        

        case UPLOAD_IMAGES_REQUEST: 
            draft.uploadImagesLoading = true;
            draft.uploadImagesDone = false;
            draft.uploadImagesError = null;    
            break;            
            
        case UPLOAD_IMAGES_SUCCESS: {
            draft.imagePaths = action.data;
            draft.uploadImagesLoading = false;
            draft.uploadImagesDone = true;
            break;
        }

        case UPLOAD_IMAGES_FAILURE:
            draft.uploadImagesLoading = false;
            draft.uploadImagesError = action.error;
            break; 
    }
});

export default reducer;