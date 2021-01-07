
// dotenv를 통해 작업할 수 있으나.. next.config.js는 next명령어를 칠때 읽히는데 
// 이때 process.env를 설정하고 싶다면 package.json에서 작업한다.
// require('dotenv').config

// ANALYZER 변수가 true여야 실행됨.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZER === 'true',
});

module.exports = withBundleAnalyzer({

    // compresstion 플러그인 대체
    compress: true,

    // webpack은 next에 기본설정이 있어서 따로하는게 아니라
    // config를 통해 기본 설정을 바꾸는 형식으로 진행
    webpack(config, { webpack }){
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [...config.plugins];

        // if(prod){
        //     // compresion-webpack-plugin은 내장되어서 더 이상 설치할 필요가 없음
        //     plugins.push(new CompressPlugin());
        // }

        return{
            ...config,
            mode: prod ? 'production' : 'development',

            // hidden-source-map하면 배포 시 소스 코드 다 노출되므로 추천
            devtool: prod ? 'hidden-source-map' : 'eval',
            plugins,
            

            // 불변성때문에 어려우면 immer 사용
            // module: {
            //     ...config.module,
            //     rules: [
            //         ...config.module.rules,
            //         {

            //         }
            //     ],
            // },
        };

        // 불변성 지켜야하는 경우 여기서도 immer 사용이 가능하다고 함
        // immer 사용
        return produce(config, (draft) => {
            
        })
    },
});