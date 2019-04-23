(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var message;
        message = sequelize.define("message", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                Body: DataTypes.STRING(500),
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    associate: function (models) {
                        message.belongsTo(models.user);
                        message.belongsTo(models.group);
                    }
                }
            }
        );
        return message;
    };
}());
