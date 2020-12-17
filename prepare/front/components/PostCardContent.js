import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => { // 첫번째 게시글 #해시태그 #익스프레스
    return(
        <div>
            {
                postData.split(/(#[^\s#]+)/g).map((v, i) => {
                    if(v.match(/(#[^\s#]+)/)){
                        return (
                            <Link
                                key={i} 
                                href={`/hashtag/${v.slice(1)}`}
                            >
                                <a>{v}</a>
                            </Link>
                        );
                    }

                    return v;
                })
            
            }
        </div>
    );
};

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
}

export default PostCardContent;

//regex
// g는 global /........./g
// .은 모든글자를 선택하고 1글자 ..이면 2글자
// +는 그 다음글자 모두
// ex: /#.+/g 는 #뒤로 모든 글자 global에서 찾기
// []는 내부에 있는 것 중에 선택
// 공백 제거는 ^\s
// ex: /#[^\s]+/g 이러면 #뒤로 모든 글자 공백이 오기전까지 global 찾기
// 그 다음 바로 #이 오면 공백이나 #일때 끊어주는것
// () 해시태그부분을 감싸줘야 포함..(split에서는)
// 완성은 /(#[^\s#]+)/g