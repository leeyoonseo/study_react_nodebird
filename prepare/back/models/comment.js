module.exports = (sequelize, DataTypes) => {

    const Comment = sequelize.define('Comment', { 
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // 대문자로?
        // 두 컬럼을 만들어서 고유한 아이디 값을 저장해야함
        // belongsTo만 가능함
        // hasMany가 있을 경우 하나의 정보만 들어가야해서 맞지않는다.
        // User_id: {},
        // Post_id: {},
    }, {
        charset: 'utf8mb4',
        // 이모티콘이 들어가면 mb4가 추가되어야함
        collate: 'utf8mb4_general_ci',
    });

    Comment.associate = (db) => {
        // hasMany 역할은 그다지 크지 않으나
        // belongsTo는 역할이 크다.
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
        
    };

    return Comment;
};