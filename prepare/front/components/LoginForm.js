// useMemo를 통해 styled 처리
import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
    margin-top:10px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

// 수작업으로 만들어도되나 라이브러리로 만드는 것도 좋음
// 하지만 실무에서는 폼 라이브러리 추천
const LoginForm = ({ setIsLoggedIn }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // 컴포넌트의 props로 넘겨주는 함수는 useCallback을 꼭 써야
    // 최적화가 된다.
    // 이렇게 똑같이 반복작업이 많기에 라이브러리 추천..
    const onChangeId = useCallback((e) => {
        setId(e.target.value);
    }, []);

    // 패턴이 비슷한데 조금씩 다른것을 처리하는 방법은 추후
    // 커스텀 훅으로 처리할 수 있다! 
    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    // 리렌더링되도 style 함수는 useMemo로 인해 캐싱되어있다.
    const styleFunc = useMemo(() => ({ marginTop: 10}), []);

    const onSubmitForm = useCallback(() => {
        // antd에 e.preventdefault넣으면안됨
        // onFinish에 적용이되어있기 때문에
        // e.preventDefault();
        console.log(id, password);
        setIsLoggedIn(true);
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