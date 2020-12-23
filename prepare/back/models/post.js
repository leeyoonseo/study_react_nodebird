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

    Post.associate = (db) => {};

    return Post;
};