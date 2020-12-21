import React from 'react';
import { useSelector } from 'react-redux';
import AppLatout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";


// AppLayout에 감싸지는 애들이 children이 됨...
const Home = () => {
    const { me } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);

    return(
        <AppLatout>
            { me && <PostForm /> }
            { mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLatout>
    );
}

export default Home;

