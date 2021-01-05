import React  from 'react';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { END } from 'redux-saga';

import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import wrapper from '../../store/configureStore';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post);

    // getStaticPaths에서 fallback: true로 하면 서버사이드 렌더링이 안되는데,
    // 여기서 클라이언트 사이드 렌더링은 할 수 있게 하는 방법은 있음..(잠깐 기다려줌) 
    if(router.isFallback){

        // fallback이 true고 paths에 경로가 없을 경우 해당하는 부분을 서버로부터 불러오는 코드를 실행함..
        // 예시: 4번 아이디 paths에 없으면 getStaticProps이 실행되서 서버에서 가져옴....
        // fallback에서 HYDRATE가 안되고있어서 에러가나는데 (next@9.4.5이상에서 고쳐짐)
        return <div>로딩중...</div>
    }

    return(
        <AppLayout>
            <Head>
                <title>
                    {singlePost.User.nickname}님의 글
                </title>
                <meta name="description" content={singlePost.content} />
                <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
                <meta property="og:description" content={singlePost.content} />
                <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'http://nodebird.com/favicon.png'} />
                <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
            </Head>
            <PostCard post={singlePost} />
        </AppLayout>
    )
};

// favicon 저작권
// Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

// export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
//     const cookie = context.req ? context.req.headers.cookie : '';
//     axios.defaults.headers.Cookie = '';

//     if(context.req && cookie){
//         axios.defaults.headers.Cookie = cookie;
//     }

//     context.store.dispatch({
//         type: LOAD_MY_INFO_REQUEST,
//     });

//     context.store.dispatch({
//         type: LOAD_POST_REQUEST,
//         data: context.params.id,
//     });

//     context.store.dispatch(END);
//     await context.store.sagaTask.toPromise();
// });

// export default Post;



// * getStaticPaths 예시
// 다우나믹라우팅일때 getStaticProps를 쓰면 getStaticPaths가 존재해야함(없으면 렌더링안됨)
// 미리 html 페이지를 만드는데 다우나믹라우터다보면 무엇을 미리 만들어야하는지 모르기때문에
// params에 넣어주는 것
export async function getStaticPaths(){
    // 전체 id를 가져와서 아래 return에 넣어주는 형식으로 할 수 있으나...
    // 사용자가 포스트를 몇개 작성하는지 모르는데, 전체를 html로 만들면 낭비...안됨
    // 따라서 개인블로그(글의 제한이 있는..) 제한이 있는 곳에서 사용하는게 좋다...
    const result = await axios.get('/post/list');
    return {
        paths: [
            { params: { id: '1' } },
            { params: { id: '2' } },
            { params: { id: '3' } },
        ],

        // false인 경우 paths에 적은 페이지들은 모두 에러가뜨고
        // true일 경우 에러가 나지는 않음(서버사이드렌더링은 안됨..)
        fallback: false,
    }
} 

export const getStaticProps = wrapper.getStaticProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if(context.req && cookie){
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.params.id,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Post;