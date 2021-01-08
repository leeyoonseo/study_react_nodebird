// immer가 IE에서 동작안하는데, 이것을 지원하기위한 작업이 필요하다(IE11)
// enableES5를 켜줘야 produce가 IE11에서 동작하는데, 
// 이게 원래는 entry point(프론트 소스코드 제일 위에) 있어야하는데.
// next는 React.dom.render()부분이 없이 알아서 처리하기때문에
// 소스코드 처음 시작부분에 넣기 어렵고 애매하다.
// 따라서 produce에서 권장하는 방법은 produce를 직접 만들어서 확장
// enableES5를 먼저 실행하고 produce가 실행되도록 만들어준다. 
import { enableES5, produce } from 'immer';

export default (...args) => {
    enableES5();
    return produce(...args);
};
