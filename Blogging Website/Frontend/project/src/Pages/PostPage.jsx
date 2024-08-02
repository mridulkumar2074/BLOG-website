import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import TimeAgo from "react-time-ago";
import { UserContext } from "../UserContext";

export default function PostPage() {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [redirect, setRedirect] = useState(false);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        axios.get(`http://localhost:3000/post/${id}`)
            .then(response => {
                setPostInfo(response.data);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error("Error fetching post:", error);
                setLoading(false); // Ensure loading is set to false even if there's an error
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    if (!postInfo) {
        return <div>Post not found</div>; // Handle the case where postInfo is still null
    }

    function goBack() {
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="outer_post_div">
            <div className="button_container">
                <button className='post_back_btn' onClick={goBack}>&#10094;&#10094;</button>
                {userInfo && userInfo.username === postInfo.author.username ? <Link className='edit_btn' to={`/post/edit/${id}`}>	EDIT</Link> : <></>}
            </div>
            <h1 className='post_page'>{postInfo.title}</h1>
            <div className='author'>Posted by <b>{postInfo.author?.username || "Unknown"} </b><TimeAgo date={new Date(postInfo.updatedAt)} /></div><br></br>
            <img src={`http://localhost:3000/${postInfo.picture}`} alt={postInfo.title}></img>
            <div className='post_page' dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
        </div>
    );
}
