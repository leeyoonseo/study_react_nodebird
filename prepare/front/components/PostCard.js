import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import Link from 'next/link';

import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import { 
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    REMOVE_POST_REQUEST,
    RETWEET_REQUEST,
} from '../reducers/post';

// 구성 기획을 먼저 해보기
const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [ commentFormOpend, setCommentFormOpend ] = useState(false);
    const id = useSelector((state) => state.user.me?.id);

    const onLike = useCallback(() => {
        if(!id){
            return alert('로그인이 필요합니다.');
        }

        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onUnlike = useCallback(() => {
        if(!id){
            return alert('로그인이 필요합니다.');
        }

        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpend((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        if(!id){
            return alert('로그인이 필요합니다.');
        }

        return dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })    
    }, [id]);

    const onRetweet = useCallback(() => {
        // 프론트, 서버 둘다 모두 처리
        if(!id){
            return alert('로그인이 필요합니다.');
        }

        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });

    }, [id]);

    const liked = post.Likers.find((v) => v.id === id);

    return(
        <div style={{ marginBottm: 20 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                // 배열안에 jsx를 넣을때 필수 key넣기
                actions={[
                    <RetweetOutlined key="retweet" onClick={onRetweet}/>,
                    liked 
                        ? <HeartTwoTone 
                                twoToneColor="#eb2f96" 
                                onClick={onUnlike}
                                key="heart" 
                        />
                        : <HeartOutlined 
                            key="heart" 
                            onClick={onLike}
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
                title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
                extra={ id && <FollowButton post={post} />}
            >
                {post.RetweetId && post.Retweet
                    ? (
                        <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
                            <Card.Meta
                                avatar={(
                                    <Link href={`/user/${post.Retweet.User.id}`}>
                                        <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                                    </Link>
                                )}
                                title={post.Retweet.User.nickname}
                                description={<PostCardContent postData={post.Retweet.content} />}
                            />
                        </Card>   
                    ) : (
                        <Card.Meta
                            avatar={(
                                <Link href={`/user/${post.User.id}`}>
                                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                </Link>
                            )}
                            title={post.User.nickname}
                            description={<PostCardContent postData={post.content} />}
                        />
                    )
                }
                
            </Card>

            {commentFormOpend && (
                <div>
                    { id && <CommentForm post={post}/> }
                    <List 
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment 
                                    author={item.User.nickname}
                                    avatar={(
                                        <Link href={`/user/${item.User.id}`}>
                                            <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                        </Link>
                                    )}
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
        createAt: PropTypes.string,
        
        // 객체들의 배열이란 뜻
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
};

export default PostCard;