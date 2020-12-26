module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define('Post', { 
        content: {
            // 길이 무제한?
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // 자동으로 PostId가 생성됨
    }, {
        charset: 'utf8mb4',
        // 이모티콘이 들어가면 mb4가 추가되어야함
        collate: 'utf8mb4_general_ci',
    });

    // 역전규화??
    // TODO 여튼 포플작업 시 관계에 대해 모르겠으면 제로초에게 질문!!!해도된다함^^
    Post.associate = (db) => {
        // 어떤 게시글은 게시자 1명에게 포함되어있다.
        db.Post.belongsTo(db.User);

        // 어떤 게시글은 여러개의 코멘트가 포함되어있다.
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);

        // n:n 관계는 둘다 belongeToMany
        db.Post.belongsToMany(db.Hashtag, {
            through: 'PostHashtag',
        });

        db.Post.belongsToMany(db.User, {
            // 중간 매핑테이블 네임을 지정해줄 수도 있다.
            // 중요한 것은 항상 매핑되는 반대쪽에도 똑같이 선언해줘야한다.(기본은 UserPost가 되기때문에)
            through: 'Like',

            // 상단에 belongsTo와 구분하기 위해 as를 추가해줄 수 있다. (별칭)
            // db user에 대한 이름을 바꿀 수 있다.
            // 대문자로 붙여주는게 좋다.
            as: 'Likers'
        });
        
        // 게시글의 리트윗 게시글
        db.Post.belongsTo(db.Post, {
            // 자동으로 생성된 PostId를 RetweetId로 변경
            // 주인이되는 사람은 1명이므로 1:n 관계
            as: 'Retweet',
        });

    };

    return Post;
};