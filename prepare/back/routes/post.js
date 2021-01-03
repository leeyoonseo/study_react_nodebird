const express = require('express');

// multer는 app.js에 장착할 수 있으나 보통 라우터에서 장착함
// 어떤 폼은 하나, 여러개 등등 전송 형식, 타입이 다르기때문에 공통적으로 사용안하는것을 추천
const multer = require('multer');
const path = require('path');

// 파일 시스템을 조작할 수 있는 모듈
const fs = require('fs');

const { Post, Image, Comment, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try{
    // uploads 폴더가 있는지 검사
    fs.accessSync('uploads');
}catch(error){
    // 폴더가 없으면 생성
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

// 폼마다 형식이 달라서 multer 미들웨어를 사용해서 라우터마다 별도로...
// 여기서 이미지를 업로드함
const upload = multer({
    // 어디에 저장? : 컴퓨터의 하드
    storage: multer.diskStorage({
        
        // 지금은 하드에 저장할건데 나중에는 클라우드에 저장할 것임..
        // 하드웨어에 저장하면 백엔드 요청이 많을 경우 서버 스케일링 시(복사?) 서버를 복사시마다 이미지가 같이 복사되서 넘어감
        // 즉 쓸데없는 용량이 문제가 될 수 있다.
        // 배포 시 s3 대체할 예정
        destination(req, file, done){
            // uploads 파일에 저장할거야
            //
            done(null, 'uploads');
        },

        // 파일명을 저장
        filename(req, file, done){ // 제로초.png

            // 중복되는 파일네임을 체크안해주면 노드는 기본적으로 덮어씌운다고함
            // 따라서 업로드 시에 파일명 뒤에 언제 업로드했는지 날짜, 시, 초를 넣어준다고함.
            // file.originalname는 파일명
            const ext = path.extname(file.originalname); // 확장자 추출(.png)

            // path는 노드에서 제공
            const basename = path.basename(file.originalname, ext); // 제로초

            done(null, basename + '_' + new Date().getTime() + ext); // 제로초12315.png로 저장됨
        },
    }),

    // 파일 사이즈 제한.. 서버 공격이 될 수도 있기때문에 용량제한도 필요함
    // 이미지, 동영상은 우리 서버에 안거치는게 좋음.. 
    // 서버비용 비쌈. 웬만하면 프론트-클라우드로 바로 올리는게 베스트임
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try{
        const hashtags = req.body.content.match(/#[^\s#]+/g);

        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        // [TODO 수정할것] 한번에 중복되는 새로운 해시태그로 등록하는 경우, 중복 갯수만큼 db에 등록됨.
        if(hashtags){
            // Hashtag.create만 할 경우 문제가 되는게, 중복되는 Hashtag에 대해서도 db에 계속 생성하게 된다.
            // 따라서 findOrCreate를 사용한다.
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ 
                // create와는 다르게 where이 추가됨
                where: { name: tag.slice(1).toLowerCase() },
            }))); // findOrCreate 사용시 [노드, true], [리액트, true] 형식으로 반환됨
            
            await post.addHashtags(result.map((v) => v[0]));
        }

        if(req.body.image){
            if(Array.isArray(req.body.image)){ // 이미지 여러개 올리면 배열로 올라감 image: ['어쩌고.png', '저쩌고.png']
                
                // 둘다 promise이기에 아래처럼 처리
                // db에는 파일 주소만 저장함 (무거워지니..)
                // 또한 db에 넣으면 캐싱을 못하기에 클라우드에 넣고 cdn 캐싱 적용하고 db에는 파일 접근 주소만 가지고 있다.
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); // sequelize에 create하는    
                await post.addImages(images);
                
            }else{ // 이미지 하나만 올리면 image: 어쩌고.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }

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

// 이미지 업로드 용 라우터 
// array가 아닌 하나의 이미지일 경우에는 upload.single('image')를 쓰면된다.
// json, text일 경우에는 upload.none이면된다.
// file input이 두개이상일 경우에는 upload.fields
// 참고: https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
    // console.log(req.files);

    try{

        // 어디에 업로드가 되었는지 파일명 전달
        res.json(req.files.map((v) => v.filename));
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
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

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
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

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try{
        await Post.destroy({
            where: { 
                id: req.params.postId, 
                
                // 삭제 시 보안을 철저히 (내가 등록한 게시글만 지우도록)
                UserId: req.user.id,
            },
        });

        res.status(200).json({
            PostId: parseInt(req.params.postId, 10)
        });

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet',
            }],
        });
        console.log('post', post);

        if(!post){
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }

        // 1) 게시자가 본인 글을 리트윗하는 것을 방지
        // 2) 게시자 글을 남이 리트윗하고 그것을 게시자가 리트윗하는 것 방지
        if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)){
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }

        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });

        if(exPost){
            return res.status(403).send('이미 리트윗했습니다.');
        }

        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            // model에서 allowNull:false로 작업했을 경우 content를 무조건 넣어야함
            content: 'retweet',
        });

        // include가 복잡해지면 db에서 데이터 요청, 응답 속도가 너무 느려지므로
        // 라우터를 분리하던가의 작업이 필요..
        // 예를들어 댓글창을 열때... 코멘트를 가져오는 라우터를 만든다던가...
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: [ 'id', 'nickname' ],
                },{
                    model: Image,
                }]
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
                }]
            }]
        });

        // 추가해야하나?
        //{
        //    model: User,
        //    as: 'Likers',
        //    attributes: [ 'id' ],
        //},

        res.status(201).json(retweetWithPrevPost);

    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;