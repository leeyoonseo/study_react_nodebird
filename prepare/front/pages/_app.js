// 모든애들에게 공통적일 경우 app.js에 넣으면되고
// layout은 일부 공통된 것들 넣기.
import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';


// <head></head>를 수정하고 싶다면 head 컴포넌트를 통해
// 수정해야한다.
import Head from 'next/head';

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

export default NodeBird;