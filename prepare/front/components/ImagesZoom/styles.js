import styled, { createGlobalStyle } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';


// slick 스타일이 깨지고 있는데,ㅠㅠ
// 이것을 수정하는 방법은?
// 라이브러리의 클래스 네임이 이미 정해져있는데, 이것을 어떻게 바꾸느냐..
// createGlobalStyle을 쓰면된다. 그 후 바꾸고 싶은애를 덮여씌운다..
// 즉 전역 스타일을 수정하는것??????
// 글로벌은 렌더링 후에 클래스명이 변환되지 않음.. 
// 적절히 사용할 것 
export const Global = createGlobalStyle`
    .slick-slide{
        display: inline-block;
    }

    .ant-card-cover{
        transform: none !important;

        & img {
            max-width: 100%;
        }
    }
`;

// ``은 styled의 문법인가?
// 아니다. ``은 자바스크립트 문법이다.
// func()를 func`` 호출할 수 있듯
// ``는 함수 호출하는 문법이다.
// 다만 ``는 일반함수 호출과 다르게 동작한다.(템플릿 리터럴)
export const Overlay = styled.div`
    position: fixed;
    z-index 5000;
    top:0;
    left:0;
    right:0;
    bottom:0;
`;

export const Header = styled.header`
    height: 44px;
    background: white;
    position: relative;
    padding: 0;
    text-align: center;

    & h1{ 
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44px;
    }
`;

export const SlickWrapper = styled.div`
    height: calc(100% - 44px);
    background: #090909;
`;

export const ImgWrapper = styled.div`
    padding: 32px;
    text-align: center;

    & img{
        margin: 0 auto;
        max-height: 750px;
    }
`;

export const CloseButton = styled(CloseOutlined)`
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
`;

export const Indicator = styled.div`
    text-align: center;

    & > div{
        width: 75px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 15px;
    }
`;