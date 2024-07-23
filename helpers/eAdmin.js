const eAdmin = (req, res, next) => {
  if(req.isAuthenticated() && eAdmin == 1){ return next()}
  req.flash("error_msg", "Você precisa ser um Admin")
  res.redirect("/")
}
export default eAdmin