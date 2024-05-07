const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

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
            //Mongoose
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



router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
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