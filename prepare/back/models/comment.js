// 5강에서 models 코드 최신화하는 방법!! (class로 하는 방법!)
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {

    // model에 init을 해줘야 테이블이 생김(comment의 init아님)
    // sequelize.define => model.init으로 바뀌었다고 생각하면됨.
    static init(sequelize) {

    // 상속받은거에서 부모를 호출할때는 super
    // init에는 인수가 2개! 
    return super.init({

        // id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // 대문자로?
        // 두 컬럼을 만들어서 고유한 아이디 값을 저장해야함
        // belongsTo만 가능함
        // hasMany가 있을 경우 하나의 정보만 들어가야해서 맞지않는다.
        // UserId: 1
        // PostId: 3
        }, {

            // 2번째인수는 설정객체
            modelName: 'Comment',

            // 자동으로 소문자, 복수로 변경
            tableName: 'comments',
            charset: 'utf8mb4',

            // 이모티콘이 들어가면 mb4가 추가되어야함 
            collate: 'utf8mb4_general_ci', // 이모티콘 저장

            // 연결객체를 class로 보내줄것이기 때문에 여기에 sequelize를 넣어줌
            sequelize,
        });
    }

    static associate(db) {

        // hasMany 역할은 그다지 크지 않으나
        // belongsTo는 역할이 크다.
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    }
};
