import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../Post";
export default function Homepage()
{   
    const [posts,setPosts]= useState([]);

    useEffect(()=>{
        axios.get('http://localhost:3000/posts').then(
            response=>{
                console.log(response.data);
                setPosts(response.data);
            }
        );

    },[]);
    return(
        <>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Post key={post._id} {...post} />
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </>
    )
}