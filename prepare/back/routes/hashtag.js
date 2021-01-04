const express = require('express');
const { Op } = require('sequelize');

const { Post, Hashtag, Image, Comment, User } = require('../models');
const router = express.Router();

router.get('/:hashtag', async (req, res, next) => { 
    try{
        const where = {};

        if(parseInt(req.query.lastId, 10)){ 
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        }

        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                [ 'createdAt', 'DESC' ],
                [Comment, 'createdAt', 'DESC' ],
            ],
            include: [{
                // include한 곳에서 조건 추가 가능
                // hashtag는 여기서 가져오기!
                model: Hashtag,
                where: { name: req.params.hashtag },
            },{
                model: User,
                attributes: [ 'id', 'nickname' ],
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: [ 'id', 'nickname' ],
                }],
            },{
                model: User,
                as: 'Likers',
                attributes: [ 'id' ],
            },{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: [ 'id', 'nickname' ],
                },{
                    model: Image,
                }]
            },],
        });

        res.status(200).json(posts);

    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;