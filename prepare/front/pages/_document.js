// _document.js는 _app.js보다 상위 파일
// 제일 위에있는 html head, body등을 수정할 수 있다.
// 여기서 서버사이드 렌더링을 해야한다.
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// _document.js는 아직까지 class로 작업
export default class MyDocument extends Document {
    // document, app에서 쓰는 특수하게 사용한다고 생각하면 편함
    // 다른데서는 보통 getServerSideProps나 getStaticProps를 쓴다고함..
    static async getInitialProps(ctx){

        // 로직은 styled-components에서 사용방법보고 했다함
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        
        try{
            // 서버사이드 렌더링 부분?
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: APP => props => sheet.collectStyles(<App {...props} />),
            });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        }finally{
            sheet.seal();
        }
    }
    
    // body만 특이하게 소문자
    // 이것을 IE에서 실행하면 라이브러리들 버전이 높아서 안돌아감.. polyfill 넣어줘야함. (babel-polyfill은 무거워서 요즘뜨는게 polyfill.io)
    // NextScript보다 위에 올려주면됨.
    render(){
        return(
            <Html>
                <Head />
                <body>
                    <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}