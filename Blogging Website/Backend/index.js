const express=require('express');
const cors=require('cors');
const mongoose= require("mongoose");
const bcrypt = require("bcryptjs");
const User= require("./model/User");
const jwt= require('jsonwebtoken');
const cookie_parser=require('cookie-parser');
const multer  = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs=require('fs');
const Post= require('./model/Post');


const app=express();
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(cookie_parser());
app.use(express.json());
app.use('/uploads',express.static(__dirname+'/uploads'));

const salt=bcrypt.genSaltSync(10);


mongoose.connect("<connection string>")
.then(()=>{ console.log("Connected to database");})
.catch(()=>{console.log("Connection failed");});
const secretKey='alksklajllkaefj392u23';


app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});

app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
    const user= await User.create({username,password:bcrypt.hashSync(password,salt)});
    res.json(user);
    }
    catch(error)
    {
        res.status(400).json(error.message);
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).json('Invalid credentials');
        }

        const correctPassword = bcrypt.compareSync(password, user.password);
        if (!correctPassword) {
            return res.status(400).json('Invalid credentials');
        }

        const token = jwt.sign({ username, id: user._id }, secretKey);
        res.cookie('token', token, { httpOnly: true }).json({username,id:user._id});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json('Internal server error');
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized: No token provided');
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.error('JWT verify error:', error);
            return res.status(401).json('Unauthorized: Invalid token');
        }
        res.json(decoded);
    });
});

app.post('/logout',(req,res)=>{
    res.clearCookie('token').json('OK');
});

app.post('/newpost', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const extension = parts[parts.length - 1];
    const newPath = `${path}.${extension}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized: No token provided');
    }

    jwt.verify(token, secretKey, async (error, info) => {
        if (error) {
            console.error('JWT verify error:', error);
            return res.status(401).json('Unauthorized: Invalid token');
        }

        try {
            const user = await User.findById(info.id);
            if (!user) {
                return res.status(404).json('User not found');
            }

            const { title, summary, content } = req.body;
            const postDoc = await Post.create({
                title: title,
                summary: summary,
                content: content,
                picture: newPath,
                author: user._id // store the ObjectId of the user
            });

            res.json(postDoc);
        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json('Internal server error');
        }
    });
});


app.get('/posts', async (req, res) => {
    try {
        const postInfo = await Post.find().populate('author', 'username').sort({createdAt:-1});
        res.json(postInfo);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json('Internal server error');
    }
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postInfo = await Post.findById(id).populate('author', 'username');
        if (!postInfo) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(postInfo);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json('Internal server error');
    }
});

app.put('/post/edit/:id', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized: No token provided');
    }

    jwt.verify(token, secretKey, async (error, info) => {
        if (error) {
            console.error('JWT verify error:', error);
            return res.status(401).json('Unauthorized: Invalid token');
        }

        try {
            const user = await User.findById(info.id);
            if (!user) {
                return res.status(404).json('User not found');
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json('Post not found');
            }

            if (!post.author.equals(user._id)) {
                return res.status(403).json('Forbidden: You are not the author of this post');
            }

            const { title, summary, content } = req.body;
            post.title = title;
            post.summary = summary;
            post.content = content;
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const extension = parts[parts.length - 1];
                const newPath = `${path}.${extension}`;
                fs.renameSync(path, newPath);
                post.picture = newPath;
            }
            await post.save();

            res.json(post);
        } catch (err) {
            console.error('Error updating post:', err);
            res.status(500).json('Internal server error');
        }
    });
});
