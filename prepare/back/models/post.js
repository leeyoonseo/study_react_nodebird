const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
            
            // id가 기본적으로 들어있다.
            content: {

                // 길이 무제한?
                type: DataTypes.TEXT,
                allowNull: false,
            },
            // RetweetId
            }, {
                modelName: 'Post',
                tableName: 'posts',
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci', // 이모티콘 저장
                sequelize,
        });
    }

    // 역전규화??
    // TODO 여튼 포플작업 시 관계에 대해 모르겠으면 제로초에게 질문!!!해도된다함^^
    static associate(db) {
        
        // sequelize에 의해 관계메서드가 생긴다. add, get, remove, set....
        // 테이블 관계를 이용할 수 있다.
        db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
        db.Post.hasMany(db.Comment); // post.addComments, post.getComments
        db.Post.hasMany(db.Image); // post.addImages, post.getImages
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }) // post.addLikers, post.removeLikers
        db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
    }
};
