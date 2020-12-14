import React from 'react';

// js 작업 시에 props 체크... typescript일 경우 필요없다.
// prop으로 넘기는 애들을 prop-types로 체크
import PropTypes from 'prop-types';

// 리액트 라우터는 Next안에서 안쓰이고 Next 자체에 라우터가 존재함
import Link from 'next/Link';

const AppLatout = ({ children }) => {
    return(
        <div>
            <div>공통메뉴</div>
            <div>
                {/* 
                    1. href를 Link 컴포넌트에 넣어야함
                    2. a 태그 추가해야함
                    3. 코드 변경 시 자동 빌드가 되는 것은 react-holoader의 기능도 Next가 하기때문..
                */}
                <Link href="/"><a>노드버드</a></Link>
                <Link href="/profile"><a>프로필</a></Link>
                <Link href="/signup"><a>회원가입</a></Link>
            </div>
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