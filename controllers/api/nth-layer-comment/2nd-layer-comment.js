// begin to add 3rd layer comment feature..
// then remember to shrink all the comments if it's too much.
const { body, check } = require('express-validator')
const MulterParser = require('../../../services/MulterParser')

const {
  authenticateCurrentUserByToken,
  checkValidation,
  myPost:{ getCurrentUserPostById },
  myComment: {getCurrentUserCommentById},
} = require('../../_helpers')

const { Post, Comment, User } = require('../../../models')

const permittedParams = [
  'content',
  'UserId',
  'PostId',
  'ParentId'
]

const validation = [
  check('content')
    .isString({min: 10}).withMessage('Comment must be a String')
    .notEmpty().withMessage('Comment is Required'),
]

const addComments = async function(req, res) {
// fetch all the posts data from db regardless of the currentUser
// create data

  const { locals: { currentPost, currentUser } } = res
  const { body: commentParam } = req

  const newComment = await Comment.create({
    UserId: currentUser.id,
    PostId: currentPost.id,
    ...commentParam,
  }, {
    fields: permittedParams,
    include: {
      association: Post.Comments,
      include: {
        association: User.Comments
      }
    }
  })

  res.render('api/nth-layer-comment/2nd-layer-comment', {
    currentUser,
    comment: newComment,
    layout: false
  })
}

module.exports = [
  MulterParser.none(),
  authenticateCurrentUserByToken('html'),
  getCurrentUserPostById('modal'),
  getCurrentUserCommentById('modal'),
  validation,
  checkValidation,
  addComments
]
