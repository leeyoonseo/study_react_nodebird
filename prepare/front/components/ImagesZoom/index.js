import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 왜 바로 ImagesZoom.js를 안만들고 폴더내에 index.js를 만드는가?
// 지저분한 것들이 많다.(styled-comonent같은거).. 이런것들 분리하려고
// 로직과 큰 상관없는 아이들을 코드 분리!
import { Overlay, Global, Header, CloseButton, ImgWrapper, SlickWrapper, Indicator } from './styles';

// 캐러셀 구현을 위한 react-slick
import Slick from 'react-slick';

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return(
        <Overlay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseButton onClick={onClose}>X</CloseButton>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick 
                        initialSlide={0}
                        // 현재 슬라이드 번호는 state로 저장해야함
                        beforeChange={(slide) => setCurrentSlide(slide)}
                        infinite
                        arrows={false}
                        slidesToScroll={1}
                    >
                        {images.map((v) =>(
                            <ImgWrapper key={v.src}>
                                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        <div>
                            {`${currentSlide + 1} / ${images.length}`}
                        </div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
};  

export default ImagesZoom;