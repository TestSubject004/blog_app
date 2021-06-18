const express = require('express')
const expressSession = require('express-session');
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const flash = require('connect-flash');
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
app.set('view engine','ejs')
app.use(express.static('public'))
const fileUpload = require('express-fileupload')
app.use(fileUpload())
const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const searchController = require('./controllers/search')
const validateMiddleware = require("./middleware/validationMiddleware");
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout')

app.use(flash());
app.use('/posts/store',validateMiddleware);
app.use(expressSession({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
    });
app.get('/',homeController)
app.get('/post/:id',getPostController)

app.post('/posts/store',authMiddleware,storePostController)
app.post('/search',searchController)
app.get('/posts/new',authMiddleware,newPostController)

app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)



app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)
app.get('/auth/login',redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)
app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'));

app.listen(4000, ()=>{
    console.log('App listening on port 4000')
})


