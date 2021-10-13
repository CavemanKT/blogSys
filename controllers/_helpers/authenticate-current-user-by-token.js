module.exports = function(format) {
  return async function(req, res, next) {
    // Since we used router.use(getUserByToken), we have access to currentUser in the controller too!
    const { locals: { currentUser } } = res

    // renders the home page and with a message.
    if (!currentUser) {
      if (format === 'json') {
        return res.status(401).json({ message: 'Please Log In First!' })
      }

      if (format === 'snippet') {
        return res.render('api/posts/not-found', { message: 'Please Log In First!', layout: false })
      }
      if (format === 'html') {
        return res.render('not-found', { message: 'Please Log In First!' })
      }
    }

    next()
  }
}
