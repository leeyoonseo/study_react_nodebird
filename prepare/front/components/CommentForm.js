import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';

const CommentForm = ({ post }) => {
    const id = useSelector((state) => state.user.me?.id);
    const [commentText, onChangeCommentText] = useInput('');
    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
    }, [commentText]);

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