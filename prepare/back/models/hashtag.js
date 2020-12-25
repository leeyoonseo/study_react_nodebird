module.exports = (sequelize, DataTypes) => {

    const Hashtag = sequelize.define('Hashtag', { 
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

    Hashtag.associate = (db) => {
        // n:n 관계는 둘다 belongeToMany
        db.Hashtag.belongsToMany(db.Post);

    };

    return Hashtag;
};