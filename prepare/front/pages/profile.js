import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';

// pagenation을 좀 쉽게해주는 도구였는데.. 없어진다고함... useSWRInfinite? 같은게 도입된다고함!
// import useSWR, { useSWRPages } from 'swr';
import useSWR from 'swr';

import Head from 'next/head';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

// fetcher를 다른걸로 바꾸면 graphql도 쓸 수 있다고함(??)
// result.data는 Followers 데이터들이 들어옴
// fatcher는 유틸같은 모듈로 빼서 swr마다 공유해서 사용, 개조 사용하면 된다고함.
// load, action이 꼭 서버사이드 렌더링되어야하는게 아니라면 swr 추천
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
    const [followersLimit, setFollowersLimit] = useState(3);
    const [followingsLimit, setFollowingsLimit] = useState(3);

    // 1) fetcher => 첫번째 인자 주소를 어떻게 실제로 가져올 것인지에 대한 것
    // - 이거쓰면 dispatch나 LOAD_MY_INFO_REQUEST 액션 같은거 안만들어도됨
    // 2) data, error가 둘다 없으면 로딩 중, 하나라도 있으면 성공했거나 실패했거나
    // 3) limit 숫자가 증가함에 따라 불필요하게 기존에 불러왔던 데이터까지 불러옴
    // - offset과 limit을 적절히 사용하여 기존 데이터는 캐싱해두고 새로불러오는 데이터만 concat으로 합치면 될듯?
    // - useEffect에 followersData의 id로 비교해서 기존 state에 concat하면 된다고 힌트를 줌....
    const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
    const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
    
    const { me } = useSelector((state) => state.user);

    useEffect(() => {
        if(!(me && me.id)){
            Router.push('/');
        }
    }, [me && me.id]);

    const loadMoreFollowings = useCallback(() => {
        setFollowingsLimit((prev) => prev + 3);
    }, []);

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3);
    }, []);

    if(followerError || followingError){
        console.error(followerError || followingError);
        return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다</div>
    }

    if(!me){
        return '내 정보 로딩중...';
    }

    return(
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                내 프로필
                <NicknameEditForm />
                <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
                <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
            </AppLayout>
        </>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if(context.req && cookie){
        axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Profile;
