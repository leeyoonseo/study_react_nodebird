// useMemo를 통해 styled 처리
import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
// action creator 가져오기
import { loginAction } from '../reducers/user';

const ButtonWrapper = styled.div`
    margin-top:10px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

const LoginForm = () => {
    const dispatch = useDispatch();

    // 커스텀 훅 추가함으로써 기존 코드들 삭제
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    // 리렌더링되도 style 함수는 useMemo로 인해 캐싱되어있다.
    // const styleFunc = useMemo(() => ({ marginTop: 10}), []);
    const onSubmitForm = useCallback(() => {
        // antd에 e.preventdefault넣으면안됨
        // onFinish에 적용이되어있기 때문에
        // e.preventDefault();
        console.log(id, password);
        dispatch(loginAction(id, password));
    }, [id, password]);

    return(
        // onFinish에는 e.preventDefault가 자동으로 적용되어있다.
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br />
                <Input 
                    name="user-id" 
                    value={id} 
                    onChange={onChangeId} 
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
                
                <Button type="primary" htmlType="submit" loading={false}>
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