import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
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
                PostId: post.id, 
                UserId: id 
            }
        });
    }, [ commentText, id ]);

    return(
        <Form 
            onFinish={onSubmitComment}
        >
            <Form.Item style={{ position: 'relative', margin: 0}}>
                <Input.TextArea 
                    value={commentText}
                    onChange={onChangeCommentText}
                    rows={4}
                />
                <Button
                    style={{ zIndex: 1, position: 'absolute', right: 0, bottom: -40 }} 
                    type="primary" 
                    htmlType="submit"
                    loading={addCommentLoading}
                >
                    삐약
                </Button>
            </Form.Item>
        </Form>
    );
};

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;