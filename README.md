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
`npm i bcrypt connect-mongo cookie-parser dotenv ejs express express-ejs-layouts express-session jsonwebtoken method-override mongoose body-parser`

Run `nodemon app.js` to start the server and view page in browser.

## Important:
You MUST register/login to access the dashboard for testing. I recommend creating a very simple username and password to test the functionality. If you forget your password, I can't help you. ;D

## API Routes
/ - Home

/add-post - Create (Post)

/post:id - Read

/edit-post:id - Update

/delete-post:id - Delete

/users - Read (User)

/admin - Create (User)

/add-comment - Read / Create (Comment)



## Note:
There isn't any client-side interaction with /users page because the interaction for that database is located within the Registration page (/admin). When you register, you are adding new details to the User database. Also, /users is also not a clickable link within the blog, it's more of a "secret page" just so you can view the api data.