import { Link } from 'react-router-dom';
import TimeAgo from 'react-time-ago';

function Post({title,summary,content,picture,updatedAt,author,_id}) {
    return (
        <div className="post_container">
            <div className="text_container">
                <Link to={`/post/${_id}`}><h2>{title}</h2></Link>
                
                <p className='author_description'><a href=''><b>{author.username}</b></a> &nbsp; &nbsp; &nbsp;<span> <TimeAgo date={new Date(updatedAt)} /></span></p>
                <p className="summary">{summary}</p>
            </div>
            <div className="image_container">
                <Link to={`/post/${_id}`}><img src={'http://localhost:3000/'+picture} alt="Threads Update" /></Link>
            </div>
        </div>
    );
}

export default Post;
