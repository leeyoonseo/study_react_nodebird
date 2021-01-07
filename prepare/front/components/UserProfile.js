import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

// action creator 가져오기
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me, logOutLoading } = useSelector((state) => state.user);
    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);

    return(
        // 배열에는 key값을 넣어줘야한다.
        <Card
            actions={[
                <div key="twit"><Link href={`/user/${me.id}`}><a>짹짹<br />{me.Posts.length}</a></Link></div>,
                <div key="followings"><Link href={'/profile'}><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
                <div key="followings"><Link href={'/profile'}><a>팔로워<br />{me.Followers.length}</a></Link></div>,
            ]}
        >
            {/* 카드컴포넌트는 아바타컴포넌트로 아바타를 넣을 수 있다. */}
            <Card.Meta 
                avatar={(
                    <Link href={`/user/${me.id}`}>
                        <a><Avatar>{me.nickname[0]}</Avatar></a>
                    </Link>
                )}
                title={me.nickname}
            />
            <Button 
                loading={logOutLoading}
                onClick={onLogOut}
            >
                로그아웃
            </Button>
        </Card>
    );
}

export default UserProfile;