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
//             title: "The Thrill of Gaming: More Than Just a Hobby",
//             body: "Gaming has grown into a global phenomenon, offering players a unique blend of entertainment, challenge, and community. Whether you're competing in online multiplayer games, exploring immersive worlds, or solving puzzles, gaming provides a thrilling escape from everyday life.

// The appeal of gaming lies in its variety—whether it's the excitement of competition, the depth of storytelling, or simply the fun of exploring new realities. It’s also become a highly social activity, with online platforms and communities connecting players worldwide.

// Gaming isn't just about fun; it can improve cognitive skills, encourage creativity, and even foster empathy. With the rise of esports and educational games, the positive impact of gaming continues to grow.

// In short, gaming is more than just a hobby—it's a vibrant, evolving experience that connects people and enriches lives."
//         },
//{
    //             title: "The Universal Language of Music",
    //             body: "Music is often called the universal language, connecting people across cultures, emotions, and even time. Its ability to evoke powerful feelings and memories is unmatched—think of how a song can transport you back to a specific moment or bring tears to your eyes. Music taps into the brain's reward centers, releasing dopamine and creating a sense of joy or nostalgia.

// Across the world, every culture has developed its own musical traditions, yet all share common elements like rhythm, melody, and harmony. These similarities hint at music's deep roots in the human experience, possibly even predating spoken language.

// Today, music has evolved into countless genres, each with its own unique sound and cultural significance. From hip-hop to classical, there's something for everyone. The rise of digital platforms and AI is pushing the boundaries of music creation, making it more accessible and diverse than ever before.

// Despite these changes, the core of music remains the same—it's a form of expression that brings people together, transcending language and borders. Whether you're listening to your favorite song or discovering a new artist, music continues to be a powerful force in our lives."
//             },
   // {
        //             title: "The Art and Science of Software Engineering",
        //             body: "Software engineering is the backbone of our digital world, responsible for designing, developing, and maintaining the software systems we rely on daily. From mobile apps to enterprise solutions, software engineers turn ideas into functional, efficient, and reliable products.

// In today’s tech-driven society, nearly every industry depends on software, making software engineering crucial across all sectors. As technology advances, the demand for skilled engineers continues to grow, with opportunities in AI, cybersecurity, and more.

// While the field presents challenges, like staying current with evolving tools and technologies, it also offers immense rewards. Engineers experience the satisfaction of solving complex problems and creating impactful solutions, all while enjoying strong career prospects.

// In essence, software engineering is a dynamic and essential field that blends technical skill with creativity, driving innovation and shaping the future.

// "
//                 },
    //    {
            //             title: "The Joy of Food: More Than Just Nourishment",
            //             body: "Food is more than just sustenance—it's a source of joy, culture, and connection. Every bite tells a story, reflecting the heritage and traditions of its origin. From the spicy flavors of Indian curry to the comforting simplicity of Italian pasta, food offers a taste of different cultures and their histories.

// Beyond nourishment, food brings people together. Whether it’s a family dinner, a holiday feast, or a casual meal with friends, sharing food fosters connection and creates lasting memories. Cooking and eating together can strengthen bonds and turn ordinary moments into special ones.

// Recently, there’s been a growing awareness of the importance of sustainable and healthy eating. People are more mindful of where their food comes from, leading to a rise in organic, plant-based, and locally sourced options. Food has become a creative outlet, with many exploring new recipes and culinary techniques.

// In essence, food is a universal language that nourishes both body and soul, connecting us to our culture and to each other."
            //         },
//         {
//             title: "The Ever-Evolving World of Web Development",
//             body: "Web development is the art of creating and maintaining websites and web applications. It’s divided into front-end development, which focuses on user interfaces, and back-end development, which handles the behind-the-scenes functionality. Some developers, known as full-stack developers, work across both areas.

//In today’s digital world, a well-designed and functional website is crucial for any business. Web developers play a key role in building sites that are not only visually appealing but also fast, accessible, and responsive across devices.

//The field is constantly evolving, with new tools and technologies emerging all the time. This makes web development an exciting and challenging career, offering plenty of opportunities for creativity and growth."
//         },
//         {
//             title: "The Art of Photography: Capturing Moments and Stories",
//             body: "Photography is not just about taking pictures; it's an art form that captures moments, emotions, and stories. From stunning landscapes to candid portraits, photography allows us to express creativity and connect with the world.

// Understanding light, composition, and camera settings is essential for great photography. Key concepts include exposure, aperture, shutter speed, and ISO, all of which contribute to creating compelling images.

// Photography has the power to tell stories without words. Genres like photojournalism highlight important issues, while portrait photography reveals the character of individuals. Exploring different styles can help photographers find their unique voice.

// Advancements in technology have transformed photography. Digital cameras and smartphones make it easier to capture high-quality images, while editing software enhances creativity. Social media platforms allow photographers to share their work with global audiences, fostering a supportive community.

// In essence, photography enriches our lives by enabling us to capture and share the beauty around us. So grab your camera and start documenting the moments that matter!"
// //         },
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