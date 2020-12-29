import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const { addCommentDone } = useSelector((state) => state.post);
    // 인자 추가
    const [commentText, onChangeCommentText, setCommentText] = useInput('');
    
    useEffect(() => {
        if(addCommentDone){
            setCommentText('');
        }
    }, [addCommentDone]);

    const onSubmitComment = useCallback(() => {
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: { 
                content: commentText, 
                postId: post.id, 
                userId: id 
            }
        });
    }, [commentText, id]);

    return(
        <Form 
            onFinish={onSubmitComment}
            style={{ position: 'relative', margin: 0 }} 
        >
            <Input.TextArea 
                value={commentText}
                onChange={onChangeCommentText}
                rows={4}
            />
            <Button
                type="primary" 
                style={{ zIndex: 1, position: 'absolute', right: 0, bottom: -40 }} 
                htmlType="submit">
                삐약
            </Button>
        </Form>
    );
};

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;