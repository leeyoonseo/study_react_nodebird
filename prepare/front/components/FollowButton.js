// next에서는 js로 작업해도되므로 파일들 확장자가 js임
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';



const FollowButton = ({ post }) => {
    const dispatch = useDispatch();
    const { me, followLoading, unFollowLoading } = useSelector((state) => state.user);
    // following 여부
    const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
    
    const onClickButton = useCallback(() => {
        if(isFollowing){
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id,
            });
        }else{
            dispatch({
                type: FOLLOW_REQUEST,
                data: post.User.id,
            });
        }

    }, [ isFollowing ]);

    return (
        <Button
            loading={followLoading || unFollowLoading}
            onClick={onClickButton}
        >
            { isFollowing ? '언팔로우' : '팔로우' }
        </Button>

    ) ;
};

// 나중에 다 object에서 변경할 것 shape!사용
FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
};

export default FollowButton;