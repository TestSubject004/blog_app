const BlogPost = require('../models/BlogPost.js')
module.exports = async(req,res)=>{
    console.log(req.body)
    const blogposts = await BlogPost.find(req.body).populate('userid');
    console.log(req.session)
    //res.sendFile(path.resolve(__dirname,'pages/contact.html'))
    res.render('search_result',{blogposts});

}