module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define('Post', { 
        content: {
            // 길이 무제한?
            type: DataTypes.Text,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        // 이모티콘이 들어가면 mb4가 추가되어야함
        collate: 'utf8mb4_general_ci',
    });

    Post.associate = (db) => {
        // 어떤 게시글은 게시자 1명에게 포함되어있다.
        db.Post.belongsTo(db.User);

        // 어떤 게시글은 여러개의 코멘트가 포함되어있다.
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);

        // n:n 관계는 둘다 belongeToMany
        db.Post.belongsToMany(db.HashTag);

    };

    return Post;
};