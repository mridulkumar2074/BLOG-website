import axios from 'axios';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
export default function CreatePostPage()
{
    const [title, setTitle]= useState('');
    const [summary,setSummary]=useState('');
    const [content, setContent]=useState('');
    const [file, setFile]=useState('');
    const [redirect, setRedirect]=useState(false);
   async function createPost(event)
    {
        event.preventDefault();
        const data= new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',file[0]);

      const response = await axios.post('http://localhost:3000/newpost',data,{headers : {
            'Content-Type': 'multipart/form-data' },withCredentials:true
        });
        if(response.status===200)
            {
                setRedirect(true);
            }
    }
    if(redirect)
        {
            return <><Navigate to={'/'}></Navigate></>
        }
    return(
        <>
        <form onSubmit={createPost}>
            <input type="title" className="create_input" placeholder={'Title'} value={title} onChange={(event)=>{setTitle(event.target.value)}}/>
            <input type="summary" className="create_input" placeholder={"Summary"} value={summary} onChange={(event)=>{setSummary(event.target.value)}}/>
            <span className='add_img'>Add Image : </span><input type="file" className='choose_img' onChange={event=>{setFile(event.target.files)}}/>
            <ReactQuill value={content} onChange={(event)=>{setContent(event)}}/>
            <button className='post_btn' type='submit'>Post</button>
        </form>
        </>


    );
}