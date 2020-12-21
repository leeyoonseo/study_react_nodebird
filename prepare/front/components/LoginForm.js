// useMemo를 통해 styled 처리
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';

import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';

// action creator 가져오기
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
    margin-top:10px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

const LoginForm = () => {
    const dispatch = useDispatch();
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const { logInLoading } = useSelector((state) => state.user);
    
    const onSubmitForm = useCallback(() => {
        console.log('onSubmitForm', email, password);
        dispatch(loginRequestAction(email, password));
    }, [email, password]);

    return(
        // onFinish에는 e.preventDefault가 자동으로 적용되어있다.
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input 
                    type="email"
                    name="user-email" 
                    value={email} 
                    onChange={onChangeEmail} 
                    required 
                />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input 
                    name="user-password" 
                    value={password} 
                    onChange={onChangePassword} 
                    required 
                />
            </div>
            {/*
                *중요함!
                디자인을 수정하기 위해 아래와같이 style에 객체를 삽입하는 경우가 있다.
                <div style={{ marginTop: 10 }}>
                귀찮아서 이렇게 많이하는데...
                이렇게하게되면 해당 함수가 리렌더링될때마다 객체가 새로 생성되는데
                {} === {} (false) 모양은 같아도 다른 것으로 취급된다.
                따라서.. 버추얼돔으로 다른 부분을 검사할때
                다른것으로 판단하기때문에 실제바뀐게 없음에도 매번 리렌더링된다.
                따라서 이럴때 styled 컴포넌트를 통해 작업한다.
                (성능에 영향이 많이없다면 집착할필요는 없지만)
            */}
            {/* <div style={{ marginTop: 10 }}> */}
            {/* 
                혹은 useMemo를 통해 사용
                <div style={styleFunc}>
            */}
            <ButtonWrapper>
                
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={logInLoading}
                >
                    로그인
                </Button>
                <Link href="/signup">
                    <a><Button>회원가입</Button></a>
                </Link>
            </ButtonWrapper>
        </FormWrapper>
    );
}

export default LoginForm;