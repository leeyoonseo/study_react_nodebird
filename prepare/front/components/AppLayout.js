import React from 'react';

// js 작업 시에 props 체크... typescript일 경우 필요없다.
// prop으로 넘기는 애들을 prop-types로 체크
import PropTypes from 'prop-types';

// 리액트 라우터는 Next안에서 안쓰이고 Next 자체에 라우터가 존재함
import Link from 'next/Link';

// antd 가져다 쓰면된다.
import { Menu, Input, Row, Col } from 'antd';

const AppLatout = ({ children }) => {
    return(
        <div>
            {/* antd menu 레이아웃 추가 */}
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>                
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Input.Search 
                        enterButton 
                        style={{ verticalAlign: 'middle' }} />
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            {children}
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