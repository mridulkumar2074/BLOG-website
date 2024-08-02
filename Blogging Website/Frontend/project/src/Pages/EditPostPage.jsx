import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from 'react-router-dom';

export default function EditPostPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        // Fetch post data for editing
        async function fetchPostData() {
            try {
                const response = await axios.get(`http://localhost:3000/post/${id}`);
                const postData = response.data;
                setTitle(postData.title);
                setSummary(postData.summary);
                setContent(postData.content);
                // Assuming the image URL is stored in the postData object
                // Update file state with the image URL
                setFile(postData.imageUrl);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        }
        fetchPostData();
    }, [id]);

    async function updatePost(event) {
        event.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        if (file) {
            data.set('file', file[0]);
        }

        try {
            const response = await axios.put(`http://localhost:3000/post/edit/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (response.status === 200) {
                setRedirect(true);
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <>
            <form onSubmit={updatePost}>
                <input type="title" className="create_input" placeholder={'Title'} value={title} onChange={(event) => { setTitle(event.target.value) }} />
                <input type="summary" className="create_input" placeholder={"Summary"} value={summary} onChange={(event) => { setSummary(event.target.value) }} />
                <span className='add_img'>Add Image : </span><input type="file" className='choose_img' onChange={event => { setFile(event.target.files[0]) }} />
                <ReactQuill value={content} onChange={(value) => { setContent(value) }} />
                <button className='post_btn' type='submit'>Update</button>
            </form>
        </>
    );
}
