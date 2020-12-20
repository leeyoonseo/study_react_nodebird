import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

import styled from 'styled-components';
import { Form, Input, Checkbox, Button } from 'antd';
import { SIGN_UP_REQUEST } from '../reducers/user';

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const dispatch = useDispatch();
    const { signUpLoading } = useSelector((state) => state.user);

    // id는 mySql이랑 충돌나서 email로 전체 변경
    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);

        // 하나 더 들어가서 커스텀훅으로 빼지 않았다.
        setPasswordError(e.target.value !== password);
    }, [password]);

    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);
    
    const ouSubmit = useCallback(() => {
        if(password !== passwordCheck){
            return setPasswordError(true);
        }

        if(!term){
            return setTermError(true);
        }

        console.log(email, nickname, password);
        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname },
        })
    }, [email, password, passwordCheck, term]);

    return(
        <AppLayout>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>

            <Form onFinish={ouSubmit}>
                <div>
                    <label htmlFor="user-email">이메일</label>
                    <br />
                    <Input 
                        type="email"
                        name="user-email" 
                        value={email} 
                        required 
                        onChange={onChangeEmail} 
                    />
                </div>

                <div>
                    <label htmlFor="user-nick">닉네임</label>
                    <br />
                    <Input 
                        name="user-nick" 
                        value={nickname} 
                        required 
                        onChange={onChangeNickname} 
                    />
                </div>

                <div>
                    <label htmlFor="user-password">비밀번호</label>
                    <br />
                    <Input 
                        name="user-password" 
                        type="password" 
                        value={password} 
                        required 
                        onChange={onChangePassword} 
                    />
                </div>

                <div>
                    <label htmlFor="user-password-check">비밀번호체크</label>
                    <br />
                    <Input 
                        name="user-password-check"
                        type="password" 
                        value={passwordCheck} 
                        required 
                        onChange={onChangePasswordCheck} 
                    />
                    {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
                </div>

                <div>
                    <Checkbox 
                        name="user-term" 
                        checked={term}
                        onChange={onChangeTerm}
                    >
                        동의합니다.
                    </Checkbox>
                    {termError && <ErrorMessage>약관 동의 필수</ErrorMessage>}
                </div>

                {/* 
                    애초부터 최적화에 집착하지 말고
                    작업 후 최적화할 수 있으면 하자
                 */}
                <div style={{ marginTop: 10 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={signUpLoading}
                    >
                        가입하기
                    </Button>
                </div>
            </Form>

        </AppLayout>
    );
}

export default Signup;
