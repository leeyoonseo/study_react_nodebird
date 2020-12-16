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

    // 게시글 추가 완료 시 true로 변경할 예정
    postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
    type : ADD_POST,
};

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
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            }
        default: 
            return state;
    }
};

export default reducer; 
