import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// js 작업 시에 props 체크... typescript일 경우 필요없다.
// prop으로 넘기는 애들을 prop-types로 체크
import PropTypes from 'prop-types';

// 리액트 라우터는 Next안에서 안쓰이고 Next 자체에 라우터가 존재함
import Link from 'next/link';

// antd 가져다 쓰면된다.
import { Menu, Input, Row, Col } from 'antd';

// 컴포넌트(순수하게 화면보여주는거)
// 리액트에서 클래스일때 컴포넌트, 컨테이너 나누어 작업을 추천했었다.
// 컴포넌트는 순수화면, 컨테이너는 데이터 가져오는 부분을 구분했었다.
// 훅스 나오면서 구분하는 것을 별로 추천하지 않는다. (리액트 공식팀입장)
// 따라서 이번강좌에서는 컴포넌트로만 작업한다.
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

// store 호출하기 위해 필요
// react-redux는 react와 redux를 연결해주는 라이브러리
import { useSelector } from 'react-redux';

// gutter로 생기는 스크롤 버그 해결방법
const Global = createGlobalStyle`
    .ant-row{
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .ant-col:first-child{
        padding-left: 0 !important;
    }

    .ant-col:last-child{
        padding-right: 0 !important;
    }
`;

// 다른 컴포넌트를 커스텀하려고 하면 styled에 넣어서 넘겨준다.
// 해당 className 관련 콘솔에러는 추후 강의에서 해결한다고 함.
const InputSearch = styled(Input.Search)`
    vertical-align: middle;
`;

const AppLatout = ({ children }) => {
    const { me } = useSelector((state) => state.user);

    return(
        <div>
            <Global />
            
            {/* antd menu 레이아웃 추가 */}
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>                
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <InputSearch enterButton />
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>

            {/* tip 모바일 디자인을 먼저, 테블릿->데탑까지해야 쉽다. */}

            {/* 컬럼간의 간격을 gutter 
                이것때문에 antd 버그가 발생하는데, (가로 스크롤 생기는것..)
            */}
            <Row gutter={8}>
                {/* 
                    반응형 컬럼 https://ant.design/components/grid/#header
                    모바일에서는 xs 24씩 차지(100%)
                    sm 50% (테블릿)
                    md 25%                
                */}
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    {/* target blank가 보안위험이 있어서 rel=noreferrer noopener를 같이 적어줘야한다. */}
                    <a href="https://okayoon.tistory.com/" target="_blank" rel="noreferrer noopener">
                        블로그
                    </a>
                </Col>
            </Row>
        </div>
    )
}

// prop체크
// children는 react의 노드 타입..
// 화면에 그리는 모든 애들을 노드라고 함(즉, return에 들어가는 애들 모두...)
AppLatout.propTypes = {
    children: PropTypes.node.isRequired,
};


export default AppLatout;