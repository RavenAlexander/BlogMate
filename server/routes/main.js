const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
var bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Routes
// GET / HOME 
router.get('', async (req, res) => {
    try {
    const locals = {
        title: "BlogMate",
        description: "Simple blog created with NodeJS, Express and MongoDB."
    }
       
    let perPage= 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ {$sort: { createdAt: -1} } ] )
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
             locals, 
             data,
            current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });

    } catch (error) {
        console.log(error);
    }

});


//GET / Post : id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        
        const data = await Post.findById( {_id: slug} );

        const locals = {
            title: data.title,
            description: '',
            currentRoute: `/post/${slug}`
        }
        res.render('post', {locals, data, currentRoute: `/post/${slug}`});
    } catch (error) {
        console.log(error);
    }
});

//POST / searchTerm
router.post('/search', async (req, res) => {
    try {
    const locals = {
        title: "Search",
        description: "",
        
    }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "") //regex

        const data = await Post.find({
            //Validation using query operators
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });
        res.render('search_results', { data, locals, currentRoute: '/search'});
    } catch (error) {
        console.log(error);
    }
})


//GET / ABOUT PAGE
router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

//GET / COMMENT WALL (This allows you to view the entries of the Comments database)
router.get('/add-comment', async (req, res) => {
    try {
        const commentData = await Comment.find( {},
        {username: 1, body: 1, contribs: 1, _id: 0});
    //console.log(commentData);
   

        const newComment = new Comment({
            username: req.body.username,
            body: req.body.body
        });

        res.render('add-comment', {
            commentData,
             newComment,
            currentRoute: '/add-comment'
            
        });
    } catch (error) {
        console.log(error);
    }

});

//POST / ADD COMMENT
router.post('/add-comment', async (req, res) => {
    try {
        
        try {
            
             const newComment = new Comment({
                body: req.body.body
            });  
            await Comment.create(newComment);

        } catch (error) {
            console.log(error);
        }

        res.redirect('/add-comment');
    } catch (error) {
        console.log(error);
    }

});

//GET / API - Users List (This allows you to view the entries of the User database. Typically I wouldn't include this data to be exposed to the public but this is for demonstration)
router.get('/users', async (req, res) => {
    try {
        
        const data = await User.find();
        res.render('users', {
           data,
           currentRoute: '/users'
        });
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;

//NOTE: This code adds sample data to the database but I commented it out because the ones that are already in there are enough. If you were to leave this running, it would add new items every time you refresh the page.
// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Building a Blog 2",
//             body: "This is the body text"
//         },
//         {
//             title: "Building a Blog 3",
//             body: "This is the body text"
//         },
//     ])
// }
// insertPostData();

// function insertUserData () {
//     User.insertMany([
//         {
//             username: "userG",
//             password: "pass"
//         },
//         {
//             username: "userH",
//             password: "pass"
//         },
//         {
//             username: "userI",
//             password: "pass"
//         }
//     ])
// }
// insertUserData();

// function insertCommentData () {
//     Comment.insertMany([
//         {
//             username: "Anon",
//             body: "Goodnight."
//         },
//         {
//             username: "Anon",
//             body: "Good morning"
//         },
//         {
//             username: "Anon",
//             body: "Good afternoon"
//         },
//     ])
// }
// insertCommentData();