import React from 'react';
import { useSelector } from 'react-redux';
import AppLatout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";


// AppLayout에 감싸지는 애들이 children이 됨...
const Home = () => {
    const { isLoggedIn } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);

    return(
        <AppLatout>
            { isLoggedIn && <PostForm /> }
            {/* 
                key에 index 넣는건 안티패턴.. 유니크값넣기
                특히 crud나 순서변경 등일 경우 index쓰면안됨..
            */}
            { mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLatout>
    );
}

export default Home;

