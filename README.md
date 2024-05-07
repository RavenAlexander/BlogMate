# SBA-MongoDB

This project is a blog built with NodeJS and Express using a MongoDB database. The blog posts are part of a database collection that can be added to, edited, deleted from, etc. There is a Posts collection, a Users collection, a Comments collection and a Sessions collection within the database.

## Objectives 
- Create a server application with Node, Express, and MongoDB.
- Create a CRUD API using Express and MongoDB.
- Create MongoDB indexes.
- Use MongoDB indexing to make efficient queries.
- Create MongoDB validation rules.
- Use MongoDB validation to ensure data consistency.

## Languages and Technologies Used
HTML, CSS, JS, NodeJS, Express, Mongoose, MongoDB, EJS (view engine)

## Installation
To run this app, you must install these dependencies:
`npm i bcrypt connect-mongo cookie-parser dotenv ejs express express-ejs-layouts express-session jsonwebtoken method-override mongoose `

Run `nodemon app.js` to start the server and view page in browser.

## Important:
You MUST register/login to access the dashboard for testing. I recommend creating a very simple username and password to test the functionality. If you forget your password, I can't help you. ;D

## API Routes
/ - Home

/add-post - Create

/post:id - Read

/edit-post:id - Update

/delete-post:id - Delete

## Blockers
I did create the schemas and data entries for the comments and the users database collections ( `models/Comment.js`, `models/User.js` and `routes/main.js`), but I ran out of time to implement them on the client-side for interaction. I plan to add those routes soon.