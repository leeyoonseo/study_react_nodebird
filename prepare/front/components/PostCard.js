import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';

import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST } from '../reducers/post';

// 구성 기획을 먼저 해보기
const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [liked, setLiked] = useState(false);
    const [commentFormOpend, setCommentFormOpend] = useState(false);


    // ?.은 새로생긴 문법이다. 있을 경우 값이 들어가고 아니면 undefined가 들어가는 옵셔닝체이닝 연산자
    // const { me } = useSelector((state) => state.user);
    // const id = me?.id;
    // 아니면 이렇게 한번에 해결
    const id = useSelector((state) => state.user.me?.id);

    const onToggleLiked = useCallback(() => {
        // 토글은 prev를 사용하면 쉽다.
        setLiked((prev) => !prev);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpend((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })    
    }, []);

    return(
        <div style={{ marginBottm: 20 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                // 배열안에 jsx를 넣을때 필수 key넣기
                actions={[
                    <RetweetOutlined key="retweet" />,
                    liked 
                        ? <HeartTwoTone 
                                twoToneColor="#eb2f96" 
                                onClick={onToggleLiked}
                                key="heart" 
                        />
                        : <HeartOutlined 
                            key="heart" 
                            onClick={onToggleLiked}
                        />, 
                    <MessageOutlined 
                        key="comment" 
                        onClick={onToggleComment}
                    />,
                    // popover는 손 올리면 더보기 버튼들이 뜬다.
                    <Popover key="more" content={(
                        <Button.Group>
                            {
                                id && post.User.id === id 
                                ? (
                                    <>
                                        <Button>수정</Button>
                                        <Button 
                                            type="danger"
                                            loading={removePostLoading}
                                            onClick={onRemovePost}
                                        >삭제</Button>
                                    </>
                                ) : <Button>신고</Button>
                            }
                        </Button.Group>
                    )}>
                        <EllipsisOutlined/>
                    </Popover>
                ]}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}
                />
            </Card>

            {commentFormOpend && (
                <div>
                    <CommentForm post={post}/>
                    <List 
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment 
                                    author={item.User.nickname}
                                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                    content={item.content}                                
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

PostCard.propTypes = {
    // object로 해도되지만
    // post: PropTypes.object.isRequired,

    // shape를 써서 내부 prop들을 정의할 수 있다.
    post: PropTypes.shape({
        id: PropTypes.number,
        
        // 이런것도 shape를 사용해 구체적으로 쓰면 좋다.
        User: PropTypes.object,
        content: PropTypes.string,
        createAt: PropTypes.object,
        
        // 객체들의 배열이란 뜻
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

export default PostCard;