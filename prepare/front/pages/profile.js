import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
    const followerList = [{ nickname: '바보'}, { nickname: '해삼'}, { nickname: '멍청이'}]
    const followingList = [{ nickname: '가나안'}, { nickname: '코코넛'}, { nickname: '숭덩'}]

    return(
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                내 프로필
                <NicknameEditForm />
                <FollowList header="팔로잉 목록" data={followingList} />
                <FollowList header="팔로워 목록" data={followerList} />
            </AppLayout>
        </>
    );
}

export default Profile;
