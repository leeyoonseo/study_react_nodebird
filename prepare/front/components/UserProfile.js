import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch } from 'react-redux';

// action creator 가져오기
import { logoutAction } from '../reducers';

const UserProfile = () => {
    const dispatch = useDispatch();
    const onLogOut = useCallback(() => {
        dispatch(logoutAction());
    }, []);

    return(
        // 배열에는 key값을 넣어줘야한다.
        <Card
            actions={[
                <div key="twit">짹짹<br />0</div>,
                <div key="followings">팔로잉<br />0</div>,
                <div key="followings">팔로워<br />0</div>,
            ]}
        >
            {/* 카드컴포넌트는 아바타컴포넌트로 아바타를 넣을 수 있다. */}
            <Card.Meta 
                avatar={<Avatar>OKAY</Avatar>}
                title="okayoon"
            />
            <Button onClick={onLogOut}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;