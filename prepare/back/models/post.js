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

        // sequelize에 의해 관계메서드가 생긴다. add, get, remove, set....
        // 테이블 관계를 이용할 수 있다.
        db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUSer
        db.Post.hasMany(db.Comment); // post.addComments, post.getComments
        db.Post.hasMany(db.Image); // post.addImages, post.getImages
        db.Post.belongsToMany(db.Hashtag, { // post.addHashtag
            through: 'PostHashtag',
        });

        db.Post.belongsToMany(db.User, { // post.addLikes, post.removeLikes
            through: 'Like',
            as: 'Likers'
        });
        db.Post.belongsTo(db.Post, { // post.addRetweet
            as: 'Retweet',
        });

    };

    return Post;
};