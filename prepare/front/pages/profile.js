import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
    const { me } = useSelector((state) => state.user);

    // 프로필에 있다가 로그아웃할때
    // 리다이렉트 처리
    useEffect(() => {
        if(!(me && me.id)){
            Router.push('/');
        }
    }, [ me && me.id]);

    if(!me){
        return null;
    }

    return(
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                내 프로필
                <NicknameEditForm />
                <FollowList header="팔로잉" data={me.Followings} />
                <FollowList header="팔로워" data={me.Followers} />
            </AppLayout>
        </>
    );
}

export default Profile;
