//protecting routes from direct access through url
module.exports = (req,res,next)=>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}