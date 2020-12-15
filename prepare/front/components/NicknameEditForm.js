import React, { useMemo } from 'react';
import { Form, Input } from 'antd';

// form은 라이브러리 추천
const NicknameEditForm = () => {
    // css쓰는법
    // 1) import css
    // 2) style-components
    // 3) useMemo를 통한 작업
    const style = useMemo(() => ({
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '30px'
    }), []);

    return(
        <Form style={style}>
            <Input.Search 
                addonBefore="닉네임" 
                enterButton="수정" 
            />
        </Form>
    );
};

export default NicknameEditForm;