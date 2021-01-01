// Next에서 React를 안써도되지만 eslint를 쓸때는 넣어주지 않으면 에러가 난다.
// 실제로 안써도 문제는 없다.
import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '../hooks/useInput';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';


const PostForm = () => {
    const { imagePaths, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if(addPostDone){
            setText('');
        }
    }, [ addPostDone ]);

    const onSubmit = useCallback(() => {
        dispatch(addPost(text));
        //setText('');
    }, [ text ]);

    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [ imageInput.current ]);

    const onChangeImages = useCallback((e) => {
        console.log(e.target.files); // 이 안에 이미지 정보가 있다. 유사배열임..
        
        // form데이터로 보내야 멀티파트형식으로 보낼수있고 이 형식으로 보내야 multer가 처리할 수 있다.
        const imageFormData = new FormData();
        
        // 배열에 forEach 메서드를 빌려서 사용
        // e.target.files는 유사배열이기 때문에 forEach메서드 제공이 안됨
        [].forEach.call(e.target.files, (f) => {

            // 키 값이랑 input, router의 키 값이 다 동일해야함....
            imageFormData.append('image', f);
        });

        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });

    }, []);

    return(
        // 이미지 업로드할때 폼에서 encType지정되어있기 때문에 저 형식으로 이미지가 올라감
        // 하지만 프론트-백에서 express에서 인코디드형식을 지정해줬는데 (urlencoded..)
        // 멀티 파트 처리하는 것을 아직안해서(백엔드에) 설정을 해줘야 받을 수 있다.(보통 비디오, 이미지등)
        // multer install 해주자
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
                    // 이미지 input에서 올린게 서버 router에서 upload의 array로 전달된다.
                    name="image"
                    multiple 
                    hidden
                    ref={imageInput}
                    onChange={onChangeImages}
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