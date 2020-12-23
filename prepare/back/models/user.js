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

    // db들간의 관계는 associate에 작성한다.
    // mysql은 관계형 데이터베이스라고함
    User.associate = (db) => {};

    return User;
};

// sequelize - model / mysql - table이라 부름