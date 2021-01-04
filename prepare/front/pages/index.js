import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import AppLatout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

import wrapper from '../store/configureStore';

// AppLayout에 감싸지는 애들이 children이 됨...
const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(state => state.post);

    useEffect(() => {
        if(retweetError){
            alert(retweetError);
        }
    }, [ retweetError ]);

    useEffect(() => {
        function onScroll(){
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                
                if(hasMorePosts && !loadPostsLoading){
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    });
                }

            }
        }

        window.addEventListener('scroll', onScroll);

        // useEffect에서 window.addEvent할때 return에서 remove해줘야함
        // 메모리 낭비됨
        return() => {
            window.removeEventListener('scrol', onScroll);
        }
    }, [hasMorePosts, loadPostsLoading, mainPosts]);

    return(
        <AppLatout>
            { me && <PostForm /> }
            { mainPosts.map((post, i) => <PostCard key={`${post.id}_${i}`} post={post} />)}
        </AppLatout>
    );
}

// next@8 버전에서
// Home.getInitialProps;
// 곧 없어질듯?
// 이 부분이 홈보다 먼저 실행됨
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    // context안에 store가 들어있다고함
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
        type: LOAD_POSTS_REQUEST,
    });

    // getServerSideProps에서 dispatch하면 store에 변화가 생기고
    // HYDRATE가 실행됨
    // init에서는 초기상태 -> getServerSideProps가 실행되면 이 결과를 HYDRATE로 보냄

    // dispatch가 비동기이므로 success가 될때까지 대기해야할 필요가 있다.
    context.store.dispatch(END);
    // store에서 sagaTask 등록해뒀음...
    await context.store.sagaTask.toPromise();
});

export default Home;

