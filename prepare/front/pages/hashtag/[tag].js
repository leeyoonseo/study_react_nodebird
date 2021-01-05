import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { END } from 'redux-saga';
import Head from 'next/head';
import { useRouter } from 'next/router';

import axios from 'axios';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';

// 특정 사용자의 게시글만 가져오기
const Hashtag = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { tag } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const onScroll = () => {
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                if(hasMorePosts && !loadPostsLoading){
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
                        data: tag,
                    });
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]); 

    return(
        <AppLayout>
            <Head>
                <title>{`해시태그 '${tag}' 글`}</title>
                <meta name="description" content={`해시태그 '${tag}' 글`} />
                <meta property="og:title" content={`해시태그 '${tag}' 글`} />
                <meta property="og:description" content={`해시태그 '${tag}' 글`} />
                <meta property="og:image" content="http://nodebird.com/favicon.png" />
                <meta property="og:url" content={`https://nodebird.com/user/${tag}`} />
            </Head>
            {
                userInfo ? (
                    <Card
                        actions={[
                            <div key="twit">
                                짹짹
                                <br/>
                                {userInfo.Posts}
                            </div>,
                            <div key="following">
                                팔로잉
                                <br/>
                                {userInfo.Followings}
                            </div>,
                            <div key="follower">
                                팔로워
                                <br/>
                                {userInfo.Followers}
                            </div>,
                        ]}
                    >
                        <Card.Meta 
                            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                            title={userInfo.nickname}
                        />
                    </Card>
                ) : null
            }

            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if(context.req && cookie){
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: context.params.tag,
    });

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Hashtag;