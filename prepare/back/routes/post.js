const express = require('express');
const router = express.Router();

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

router.post('/', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User, // 댓글 작성자
                    attributes: [ 'id', 'nickname' ],
                }]
            },{
                model: User, // 게시글 작성자
                attributes: [ 'id', 'nickname' ],
            }, {
                model: User, // 좋아요 누른사람
                // 이것을 넣어야 post.Likers가 생성됨
                as: 'Likers',
                attributes: [ 'id' ],
            }]
        })

        res.status(201).json(fullPost);

    }catch(error){
        console.error(error);
        next(error);
    }
});

// postId 파라미터
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try{

        // 프론트, 브라우저는 믿을게 못되서 철저히 검사해서
        // 해당 코멘트가 등록한 사용자가 맞는지 검사해야한다.
        // 다른 게시물에 등록, 삭제 할 수 있기 때문에!!
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });

        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }

        const comment = await Comment.create({
            content: req.body.content,

            // req.body로 접근가능하기도 하나 params가 좀더 명확
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });

        const fullComment = await Comment.findOne({
            whehe: { id: comment.id }, 
            include: [{
                model: User,
                attributes: [ 'id', 'nickname' ],
            }]
        })

        res.status(201).json(fullComment);

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });

        if(!post){
            return res.status(403),send('게시글이 존재하지 않습니다.');
        }

        // 모델에서 belongsToMany as...썼을때 
        // 이때 Post.addLikes 같은 관계 메서드가 자동으로 생긴다.(sequelize에서)
        await post.addLikers(req.user.id);
        res.json({ 
            PostId: post.id, 
            UserId: req.user.id 
        });

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });

        if(!post){
            return res.status(403),send('게시글이 존재하지 않습니다.');
        }

        // mysql로도 할수있으니 공식문서보도록
        await post.removeLikers(req.user.id);
        res.json({ 
            PostId: post.id, 
            UserId: req.user.id 
        });
        
    }catch(error){
        console.error(error);
        next(error);
    }
});

// router.delete('/', (req, res) => {
//     res.json({ id:1, content: 'hello' });
// });

module.exports = router;