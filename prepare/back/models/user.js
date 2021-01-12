const DataTypes = require('sequelize');
const { Model } = DataTypes;

// MySQL에는 자동으로 'users' 테이블을 생성(소문자, 복수로 변환)
// sequelize, mysql 규칙임
module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({

            // id는 mysql에서 자동으로 넣어주기때문에(1,2,3...순으로 증가) 안써도됨
            // id: {},
            // 각 column
            // id가 기본적으로 들어있다.
            email: {
                type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
                allowNull: false, // 필수
                unique: true, // 고유한 값
            },
            nickname: {
                type: DataTypes.STRING(30),
                allowNull: false, // 필수
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false, // 필수
            },
        }, {
            modelName: 'User',
            tableName: 'users',
            // 이 2개해야 한글가능


            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
            sequelize,
        });
    }

    // mysql은 관계형 데이터베이스라고함
    // db들간의 관계는 associate에 작성한다.
    // 1:1, 1:n 관계인지..
    static associate(db) {

        // 한사람이 여러 게시글을 작성할 수 있음.
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);

        // 1:1 (유저랑 유저정보일경우 1:1일텐데)
        // db.User.hasOne(db.UserInfo);
        // belongsTo가 들어가는 곳에 user_id, post_id값이 생김
        // n:1은 없다.
        // n:n 관계는 둘다 belongeToMany
        db.User.belongsToMany(db.Post, { 
                
            // 중간 매핑테이블 네임을 지정해줄 수도 있다.
            // 중요한 것은 항상 매핑되는 반대쪽에도 똑같이 선언해줘야한다.(기본은 UserPost가 되기때문에)
            through: 'Like', 
            as: 'Liked' 
        })

        // 팔로워
        // 같은 db 컬럼(?) 작업을 할때 foreignKey가 등장한다.
        // (찾기 시작하는 시작점이 되는 것)
        db.User.belongsToMany(db.User, {

            // 테이블이름변경
            through: 'Follow', 
            as: 'Followers', 

            // 왜 User-User일때 foreignKey가 등장하는가?
            // 컬럼의 아이디를 바꿔주는것?
            foreignKey: 'FollowingId' 
        });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
    }
};
// sequelize - model / mysql - table이라 부름
