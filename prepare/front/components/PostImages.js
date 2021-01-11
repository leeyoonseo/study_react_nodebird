import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';

import backUrl from '../config/config';

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    // alt 중요
    // facebook은 자동으로 alt를 러닝머신으로 넣어주는 경우가있다함
    // 신기하다.
    if(images.length === 1){
        return(
            <>
                <img 
                    src={`${backUrl}/${images[0].src}`} 
                    alt={images[0].src} 
                    // 클릭은 버튼, input등에 넣는데
                    // img에 클릭을 넣으면 장애인들이 헷갈려함
                    // 그래서 굳이 누를필요가 없다는 것는 role을 작성해야한다.
                    // 스크린리더에서 굳이 클릭할 필요없다는 것을 알려줌
                    role="presentation"
                    onClick={onZoom} 
                />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }

    if(images.length === 2){
        return(
            <>
                <img 
                    style={{ display: 'inline-block', width: '50%' }}
                    src={`${backUrl}/${images[0].src}`} 
                    alt={images[0].src} 
                    onClick={onZoom} 
                />
                <img 
                    style={{ display: 'inline-block', width: '50%' }}
                    src={`${backUrl}/${images[1].src}`} 
                    alt={images[1].src} 
                    onClick={onZoom} 
                />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }

    return(
        <>
            <div>
                <img 
                    style={{ width: '50%' }}
                    src={`${backUrl}/${images[0].src}`} 
                    alt={images[0].src} 
                    onClick={onZoom} 
                />
                <div
                    role="presentation"
                    style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length -1}
                    더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    );
};

PostImages.propTypes = { 
    images: PropTypes.arrayOf(PropTypes.object),
}

export default PostImages;