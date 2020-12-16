// Next에서 React를 안써도되지만 eslint를 쓸때는 넣어주지 않으면 에러가 난다.
// 실제로 안써도 문제는 없다.
import React, { useCallback, useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../reducers/post';

const PostForm = () => {
    const { imagePaths } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    
    // ref를 통한 돔 조작
    const imageInput = useRef();
    const [text, setText] = useState('');

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onSubmit = useCallback(() => {
        dispatch(addPost);
        setText('');
    }, []);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    return(
        <Form 
            encType="multipart/form-data" 
            onFinish={onSubmit}
            style={{ margin: '10px 0 20px' }}
        >
            <Input.TextArea 
                value={text} 
                onChange={onChangeText} 
                maxLength={140} 
                placeholder="어떤 일이 있었나요?"
            />
            <div>
                <input 
                    type="file" 
                    multiple 
                    hidden
                    ref={imageInput}
                />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button 
                    type="primary" 
                    style={{ float: 'right' }}
                    htmlType="submit"
                >짹짹</Button>
            </div>

            {/* map안에 있는 애들도 컴포넌트로 분리하면 좋다. */}
            <div>
                {imagePaths.map((v) => (
                    <div key={v} style={{ display: 'inline-block' }}>
                        <img src={v} style={{ width: '200px' }} alt={v} />
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;