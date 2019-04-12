(function () {
    'use strict';

    var db = require('../models/index');

    var init = function (router) {
        router.get('/get-messages-by-group', endpoints.getMessagesByGroup);
        router.post('/send-message', endpoints.sendMessage);
    };

    var endpoints = {

        getMessagesByGroup: function (request, response) {
            // var groupId = request.query.GroupId;
            // return MessageModel.findAll({
            //     where: {
            //         groupID: groupId
            //     },
            //     include: [MessageModel]
            // }).then(function (data) {
            //     response.send({success: true, groups: data});
            // });
        },

        sendMessage: function (request, response) {
            // var groupName = request.body.GroupName;
            // var userIds = request.body.UserIds;
            // return MessageModel.create({
            //     Name: groupName,
            //     IsActive: true
            // }).then(function (data) {
            //     updateGroupUsers(data.ID, userIds);
            //     response.send({success: true, group: data});
            // });
        },
    };

    module.exports = {
        init: init
    };

}()
);
