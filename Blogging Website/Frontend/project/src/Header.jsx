import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:3000/profile', { withCredentials: true })
            .then(response => {
                const userInfo = response.data;
                setUserInfo(userInfo);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                if (error.response && error.response.status === 401) {
                    setUserInfo(null);
                }
            });
    }, [setUserInfo]);

    function logout() {
        axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
            .then(() => {
                setUserInfo(null);
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    }

    const username = userInfo ? userInfo.username : null;

    return (
        <header>
            <img 
                src="https://thumbs.dreamstime.com/b/cartoon-crocodile-swimming-28415644.jpg" 
                className="croc_img floating" 
                alt="Crocodile"
            />
            <Link to='/' className="heading mint">CrocBlog</Link>
            <nav>
                {username ? (
                    <>
                        <Link to='/create' className="heading_sgn">Create</Link>
                        <Link to='/' className='heading_sgn' onClick={logout}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to='/login' className="heading_sgn">Login</Link>
                        <Link to='/register' className="heading_sgn">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
