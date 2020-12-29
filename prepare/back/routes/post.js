const express = require('express');
const router = express.Router();

const { Post, Image, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

// 주소가 겹치면 use에서 인수를 먼저 넘긴다.
// prefix가 될 수 있도록
router.post('/', isLoggedIn, async (req, res) => {
    try{
        const post = await Post.create({
            content: req.body.content,

            // passport 가 실행되면 id를 저장했다가
            // 사용자 정보를 저장해서 reqID를 만들기때문에?
            // userID를 들고댕김?
            UserId: req.user.id,
        });

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            },{
                model: Comment,
            },{
                model: User,
            }]
        })

        // 프론트로 돌려줌
        res.status(200).json(fullPost);

    }catch(error){
        console.error(error);
        next(error);
    }
});

// postId 파라미터
router.post('/:postId/comment', isLoggedIn, async (req, res) => {
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
            contet: req.body.content,

            // req.body로 접근가능하기도 하나 params가 좀더 명확
            PostId: req.params.postId,
            UserId: req.user.id,
        });

        res.status(200).json(comment);

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/', (req, res) => {
    res.json({ id:1, content: 'hello' });

});

module.exports = router;