import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import CreatePostPage from './Pages/CreatePostPage'
import EditPostPage from './Pages/EditPostPage'
import Homepage from './Pages/Homepage'
import LoginPage from './Pages/LoginPage'
import PostPage from './Pages/PostPage'
import SignUpPage from './Pages/SignUpPage'
import { UserContextProvider } from './UserContext'
function App() {
 

  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Homepage/>} />
      <Route path={'/login'} element={<LoginPage/>}/>
      <Route path={'/register'} element={<SignUpPage/>}/>
      <Route path={'/create'} element={<CreatePostPage/>}/>
      <Route path={'/post/:id'} element={<PostPage/>}/>
      <Route path={'/post/edit/:id'} element={<EditPostPage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
