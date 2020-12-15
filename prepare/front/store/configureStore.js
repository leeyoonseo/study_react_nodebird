// store 설정을 하는 store js를 만든다.
// 이게 기본 셋팅
import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux'; 

// redux 개념?
// - 여러 페이지들의 공통적인 데이터
// ex) 로그인 사람 정보, 로그인 여부등..
// 이런 데이터들이 컴포넌트 분리에 의해 흩어져있다.
// 혹은 부모 컴포넌트에서 자식으로 보내줘야하는 과정이 있는데
// 매번 수동으로 작업하기에는 귀찮고 힘들다
// 그렇기 때문에 중앙에서 관리하는 (중앙데이터) 역할
// contextAPI도 같은 역할을 한다. redux, mobx....등..
// - 어떤것을 써야하는가? 
// 규모가 크면 저장소 1개는 필수
// 가장 많이 선택 redux, 생산성 mobx, 앱이 작다 = contextAPI
// redux는 에러나도 추적이 쉬움, 앱 안정.. 단점 코드량이 많아짐
// mobx 코드량 적음, 트래킹이 어려움
// - 비동기를 다룰땐 실패에 대비해야하는데 
// 요청, 성공, 실패..의 단계 대비
// contextAPI는 3단계를 직접 구현해야한다.
const configureStore = () => {
    const store = createStore(reducer, enhancer);
    
    return store;
};

// 두번째 인자는 옵션 객체
const wrapper = createWrapper(configureStore, {
    // 디버그 부분이 트루일 경우 리덕스관련 자세한 설명이 나옴
    // 개발시에는 true로 두는게 편할 듯
    debug: process.env.NODE_ENV === 'development',
});

export default wrapper;