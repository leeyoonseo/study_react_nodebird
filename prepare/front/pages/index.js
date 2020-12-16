// import React from 'react';
// Next에서는 위의 구문이 필요없다.
// pages 폴더명은 무조건 pages여야한다.
// Next가 pages 폴더를 인식해서 내부에 있는 파일들을 코드스필릿팅해준다.

import AppLatout from "../components/AppLayout";

// AppLayout에 감싸지는 애들이 children이 됨...
const Home = () => {
    return(
        <AppLatout>
            <div>index</div>
        </AppLatout>
    );
}

export default Home;

