import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const Profile = () => {
    const { userInfo } = useSelector((state) => state.user);

    return(
        <AppLayout> 
            <Head>
                <title>홍길동 | NodeBird</title>
            </Head>
            {userInfo ? (
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
                        </div>
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                        description="노드버드 매니아"
                    />
                </Card>
            ) 
            :
            null}
        </AppLayout>
    );
}

// getStaticProps: 언제 접속해도 데이터가 바뀔일이 없으면 
// - 쓰기어려움, 블로그 게시글처럼 잘 안바뀌는애들.. 빌드할때 정적인 html로 뽑아줌
// - 쓰기 애매한 이유는 블로그 게시글, 뉴스.. 미리 html로 만들어놓기 힘듬, 
// - NAVER 메인화면을 예로들면 실시간 뉴스&검색어&변경되는 컨텐츠들이 있기에 html로 하기 힘듬
// - 개인화페이지(그 시간 그 사람이기때문에 보는...)
// - 아마존 상품페이지 같은 경우는 상품가격, 재고, 할인률등이 변하기 때문에 getStatic으로 쓰기 애매함!!)

// getServerSideProps: 접속한 상황에 따라 화면전환이 있으면 
// - 웬만해서 많이씀, 방문했을때 그때그때 데이터가 달라지는 부분을 담당...

export const getStaticProps = wrapper.getStaticProps(async (context) => {
    // 특정 사용자 정보 가져오기
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: 1,
    });

    // success 까지 대기, 사용방법 외우기
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Profile;
