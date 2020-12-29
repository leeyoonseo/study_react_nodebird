import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppLatout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';


// AppLayout에 감싸지는 애들이 children이 됨...
const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(state => state.post);

    useEffect(() => {
        dispatch({
            type: LOAD_MY_INFO_REQUEST,
        });

        dispatch({
            type: LOAD_POSTS_REQUEST,
        });
    }, []);

    useEffect(() => {
        function onScroll(){
            // 스크롤 높이 구할때, 아래 세개를 가장 많이 씀
            console.log(
                
                // document 총 길이에서 얼마나 내렸는지
                // window.scrollY,

                // 브라우저 화면 보이는 길이
                // document.documentElement.clientHeight, 

                // document 총 길이
                // document.documentElement.scrollHeight
            );
            
            // scrollY + clientHeight = scrollHeight
            // 2개를 더해서 끝까지 내린것을 판단할 수 있음
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                // loadPostsLoading로 여러번 호출되는 것 방지
                if(hasMorePosts && !loadPostsLoading){
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                    });
                }
            }
        }

        window.addEventListener('scroll', onScroll);

        // useEffect에서 window.addEvent할때 return에서 remove해줘야함
        // 메모리 낭비됨
        return() => {
            window.removeEventListener('scrol', onScroll);
        }
    }, [ hasMorePosts, loadPostsLoading ]);

    return(
        <AppLatout>
            { me && <PostForm /> }
            { mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLatout>
    );
}

export default Home;

