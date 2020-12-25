module.exports = (sequelize, DataTypes) => {

    // MySQL에는 자동으로 'users' 테이블을 생성(소문자, 복수로 변환)
    // sequelize, mysql 규칙임
    const User = sequelize.define('User', { 
        // id는 mysql에서 자동으로 넣어주기때문에(1,2,3...순으로 증가) 안써도됨
        // id: {},

        // 각 column
        email: {
            type: DataTypes.STRING(30), // 많이쓰는애들.. STRING, TEXT (긴글), BOOLEAN, INTEGER, FLOAT, DATETIME

            // 필수여부
            allowNull: false, // 필수, true = 선택적
            unique: true, // 중복되면 안되기에 고유한 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            // 암호화해서 길이가 김
            type: DataTypes.STRING(100),
            allowNull: false,
        },

    }, {
        // 이 2개해야 한글가능
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    // mysql은 관계형 데이터베이스라고함
    // db들간의 관계는 associate에 작성한다.
    // 1:1, 1:n 관계인지..
    User.associate = (db) => {
        // 한사람이 여러 게시글을 작성할 수 있음.
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);

        // 1:1 (유저랑 유저정보일경우 1:1일텐데)
        // db.User.hasOne(db.UserInfo);
        // belongsTo가 들어가는 곳에 user_id, post_id값이 생김
        // n:1은 없다.
    };

    return User;
};

// sequelize - model / mysql - table이라 부름