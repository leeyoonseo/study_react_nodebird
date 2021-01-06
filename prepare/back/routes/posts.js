const express = require('express');
const { Op } = require('sequelize');

const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
    try {
        const where = {};

        // 마지막 포스트 가져오기는 쿼리스트링..
        // 쿼리스트링이어서 req.query.lastId처럼 사ㅛㅇ가능
        if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때

            // 과거에는 { $lt: parseInt(req.query.lastId, 10) } 사용했었는데, 사라짐.
            // sql injection 공격 가능성이 있어서 사라짐
            // 따라서 sequelize op사용(op는 operator임)
            // 이렇게 하면 조건이.... id가 lastId보다 작은 으로 변경됨
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

        // 이렇게 하면 모든 게시글을 가져옴
        const posts = await Post.findAll({
            where,

            // 몇개만 가져와라
            limit: 10,

            // 1~10번, 즉 해당 번호부터 가져와라
            // offset: 0, 

            // 실무에서는 limit, offset은 잘안쓴다고함
            // 왜? 치명적 단점
            // 중간에 사람이 게시글 지우거나 추가하면...
            // 로딩하는 와중에 게시글을 생성하면 limit, offset이 꼬여서..
            // 다음 limit offset할때 글을 두번 불러오는 문제가 생길 수 있다.
            // 따라서 offset 대신에 lastId 방식을 많이쓴다
            // lastId는 db가 제공하는것이 아니라 구현해야한다.
            // 이렇게하면 마지막id를 기준으로..
            // where: { id: lastId },

            // 정렬안해주면 과거꺼부터 게시글을 가져옴
            // 2차원배열, 여러 기준으로 정렬할 수 있기 때문에
            // 정렬하는것, 기본값음 ASC이나 최신것부터는 DESC로 넣어줌
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        console.log(posts);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
