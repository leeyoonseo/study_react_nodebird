// 모든애들에게 공통적일 경우 app.js에 넣으면되고
// layout은 일부 공통된 것들 넣기.
import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

// Redux
import wrapper from '../store/configureStore';

// <head></head>를 수정하고 싶다면 head 컴포넌트를 통해
// 수정해야한다.
import Head from 'next/head';

// next@6 이상부터 provider로 감싸주지 않아도 됨
const NodeBird = ({ Component }) => {
    return(
        <>
            {/* 공통되지 않는 head라면 index에 넣으면된다. */}
            <Head>
                <meta charSet="utf-8" />
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    );
};

NodeBird.protoTypes = {
    Component: PropTypes.elementType.isRequired,
}

// 서버사이드렌더링 시 withReduxSaga 제거
export default wrapper.withRedux(NodeBird);