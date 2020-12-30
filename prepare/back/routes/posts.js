const express = require('express');

const router = express.Router();
const { Post, User, Image, Comment } = require('../models');

router.get('/', async (req, res, next) => {
    try{
        // 이렇게 하면 모든 게시글을 가져옴
        const posts = await Post.findAll({
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
                [ 'createdAt', 'DESC' ],

                // 아래 include에서 정렬이 필요한경우
                [Comment, 'createdAt', 'DESC' ],
            ],

            include: [{
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
            }],

            // 특성 작성자 예시
            // where: { UserId: 1 }
        });

        // 요청, 응답 기록하기
        res.status(200).json(posts);

    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;