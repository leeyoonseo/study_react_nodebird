module.exports = (sequelize, DataTypes) => {

    const Image = sequelize.define('Image', { 
        src: {
            // url이라 길어질 수 있음
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };

    return Image;
};