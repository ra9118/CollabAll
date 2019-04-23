(function () {
    'use strict';

    var db = require('../models/index');

    var MessageModel = db.message;
    var UserModel = db.user;
    var GroupModel = db.group;

    var init = function (router) {
        router.get('/get-messages-by-group', endpoints.getMessagesByGroup);
        router.post('/send-message', endpoints.sendMessage);
    };

    var endpoints = {

        getMessagesByGroup: function (request, response) {
            var groupId = request.query.groupID;
            return MessageModel.findAll({
                where: {
                    groupID: groupId
                },
                include: [UserModel, GroupModel]
            }).then(function (data) {
                console.log(data)
                let data2 = []
                data.map(dat => {
                    console.log(dat.user)
                    data2.push({
                        body: dat.Body,
                        user: dat.user.FirstName + ' ' + dat.user.LastName,
                        userID: dat.user.ID,
                        userAvatar: '',
                        groupID: dat.group.ID,
                        timestamp: dat.createdAt
                    })
                })
                console.log(data2)
                response.send({success: true, messages: data2});
            });
        },

        sendMessage: function (request, response) {
            var groupId = request.body.groupID;
            var userId = request.body.userID;
            var body = request.body.body;
            return MessageModel.create({
                Body: body,
                groupID: groupId,
                userID: userId,
                IsActive: true
            }).then(function (data) {
                response.send({success: true, message: data});
            });
        },
    };

    module.exports = {
        init: init
    };

}()
);
