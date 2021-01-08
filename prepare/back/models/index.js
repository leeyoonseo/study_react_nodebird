const Sequelize = require('sequelize');

// class로 문법이 바뀌었기 때문에 문법이 변경되어야함!!
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};


// Node - mySql 연결. 
// sequelize는 내부적으로 mysql2 사용 중
// 연결 시 연결정보가 리턴되서 sequelize에 담김
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 모델생성한것들 불러오기
// 인수 전달하는건데.. (sequelize, DataTypes) 뭐지? 실행하면서 모델이 실제로 sequelize에 등록된다는데...
// class로 문법이 바뀌었기 때문에 문법이 변경되어야함!!
// class를 넣어주면 바로 쓸수있는데. 반복문돌면서 아래작업을해줘야함
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

// class를 넣어주면 바로 쓸수있는데. 반복문돌면서 init을 추가로 작업을해줘야함
// 위에서 db에 5개 모델 등록했하고 아래서 반복돌면서 associate의 관계들을 연결 쭉해주는것임
Object.keys(db).forEach(modelName => {
    db[modelName].init(sequelize);
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
