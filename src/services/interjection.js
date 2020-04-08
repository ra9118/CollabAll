(function () {
        'use strict';

        var db = require('../models/index');
        let https = require ('https');

        var GroupInterjectionModel = db.group_interjection;
        var GroupModel = db.group;


        var init = function (router) {
            router.get('/get-interjections-for-group', endpoints.getGroupInterjections);
            router.get('/get-auto-suggest-for-group', endpoints.getAutoSuggest);
            router.get('/get-interjection-by-id-for-group', endpoints.getGroupInterjectionById);
            router.post('/create-interjections-for-group', endpoints.createGroupInterjection);
            router.post('/update-interjections-for-group', endpoints.updateGroupInterjection);
            router.post('/delete-interjections-for-group', endpoints.deleteGroupInterjection);
            router.post('/set-default-interjections-for-group', endpoints.setGroupDefaultInterjections);

            router.post('/send-interjection', endpoints.sendInterjection);
        };

        var endpoints = {

            getGroupInterjections: function (request, response) {
                var groupId = request.query.GroupId;
                return GroupInterjectionModel.findAll({
                    where: {
                        groupID: groupId
                    },
                    include: [GroupModel],
                    order: "Position"
                }).then(function (data) {
                    response.send({success: true, interjections: data});
                });
            },

            getAutoSuggest: function (request, responseOuter) {
                let searchQuery = request.query.searchQuery;

                console.log("=========== getAutosuggests1 ===============");
                console.log(searchQuery);

                let obj='';

                let subscriptionKey = 'bb43790371de49c7851a968e2808977d';
                let host = 'collaballautosuggest.cognitiveservices.azure.com';
                let path = '/bing/v7.0/Suggestions';
                let mkt = 'en-US';
                let params = '?mkt=' + mkt + '&q=' + encodeURI(searchQuery);
                let request_params = {
                    method : 'GET',
                    hostname : host,
                    path :  path + params,
                    headers : {
                        'Ocp-Apim-Subscription-Key' : subscriptionKey,
                    }
                };
                let req = https.request(request_params,
                    function (response) {
                        let body = '';

                        response.on ('data', function (d) {
                            body += d;
                        });

                        response.on('end',function(){
                            obj = JSON.parse(body);
                            console.log("=========== response end ===============");
                            console.log(obj);

                            let recomendedList =[];
                            if(obj!=''){

                                obj.suggestionGroups.forEach(function(value) {
                                    for( let index in value.searchSuggestions){
                                        console.log(value.searchSuggestions[index].displayText );
                                        console.log(value.searchSuggestions[index].url );
                                        recomendedList.push(value.searchSuggestions[index].displayText)
                                        console.log("====");
                                    }
                                });
                            }else{
                                console.log('no object =========>');
                            }

                            console.log(recomendedList);
                            responseOuter.send({success: true, autoSuggestList: recomendedList});

                        });

                        response.on ('error', function (e) {
                            console.log ('Error: ' + e.message);
                        });
                    }
                   );

                req.end();


            },

            getGroupInterjectionById: function (request, response) {
                var interjectionId = request.query.GroupInterjectionId;
                return GroupInterjectionModel.findOne({
                    where: {
                        id: interjectionId
                    },
                    include: [GroupModel],
                    order: "Position"
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            setGroupDefaultInterjections: function (request, response) {
                var groupId = request.body.GroupId;
                return GroupInterjectionModel.bulkCreate([
                    {groupID:groupId, Position:0, Title: 'Slow Down!', Description: 'Slow Down!', Icon:'fa fa-stop', BackgroundColor:'#5bc0de',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true,Sound:'beep-07'},
                    {groupID:groupId, Position:1, Title: 'I am Done Communicating!', Description: 'I am Done Communicating!', Icon:'fa fa-check-circle-o', BackgroundColor:'#BF5FFF',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true,Sound:'beep-07'},
                    {groupID:groupId, Position:2, Title: 'Question!', Description: 'Question!', Icon:'fa fa-question', BackgroundColor:'#f0ad4e',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true, Sound:'beep-07'},
                    {groupID:groupId, Position:3, Title: 'Repeat!', Description: 'Question!', Icon:'fa fa-repeat', BackgroundColor:'#3ca2e0',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true, Sound:'beep-07'},
                    {groupID:groupId, Position:4, Title: 'Don\'t Understand!', Description: 'Don\'t Understand!', Icon:'fa fa-exclamation', BackgroundColor:'#AEB6BF',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true, Sound:'beep-07'},
                    {groupID:groupId, Position:5, Title: 'Agree!', Description: 'Agree!', Icon:'fa fa-thumbs-o-up', BackgroundColor:'#229954',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true,Sound:'beep-07'},
                    {groupID:groupId, Position:6, Title: 'Disagree!', Description: 'Disagree!', Icon:'fa fa-thumbs-o-down', BackgroundColor:'#C70039  ',TextColor:'#fff',IncludeCaptionist:true,IncludeInterpreter:true,IsActive:true,Sound:'beep-07'},
                ]).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            createGroupInterjection: function (request, response) {
                var groupId = request.body.GroupId;
                var interjectionTitle = request.body.InterjectionTitle;
                var interjectionDescription = request.body.InterjectionDescription;
                var interjectionIcon = request.body.InterjectionIcon;
                var interjectionBackgroundColor = request.body.InterjectionBackgroundColor;
                var interjectionTextColor = request.body.InterjectionTextColor;
                var interjectionCaptionist = request.body.InterjectionCaptionist;
                var interjectionInterpreter = request.body.InterjectionInterpreter;
                var interjectionPosition = request.body.InterjectionPosition;
				var interjectionSound = request.body.InterjectionSound;
				console.log(request.body);
                return GroupInterjectionModel.create({
                    Title: interjectionTitle,
                    Description: interjectionDescription,
                    Icon: interjectionIcon,
                    TextColor: interjectionTextColor,
                    BackgroundColor: interjectionBackgroundColor,
                    IncludeCaptionist: interjectionCaptionist,
                    IncludeInterpreter: interjectionInterpreter,
                    Position: interjectionPosition,
                    groupID: groupId,
                    IsActive: true,
					Sound: interjectionSound
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            deleteGroupInterjection: function (request, response) {
                var interjectionId = request.body.GroupInterjectionId;
                return GroupInterjectionModel.destroy({
                    where: {
                        ID: interjectionId
                    }
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },

            updateGroupInterjection: function (request, response) {
                var interjectionId = request.body.GroupInterjectionId;
                var groupId = request.body.GroupId;
                var interjectionTitle = request.body.InterjectionTitle;
                var interjectionDescription = request.body.InterjectionDescription;
                var interjectionIcon = request.body.InterjectionIcon;
                var interjectionBackgroundColor = request.body.InterjectionBackgroundColor;
                var interjectionTextColor = request.body.InterjectionTextColor;
                var interjectionCaptionist = request.body.InterjectionCaptionist;
                var interjectionInterpreter = request.body.InterjectionInterpreter;
                var interjectionPosition = request.body.InterjectionPosition;
				var interjectionSound = request.body.interjectionSound;
                return GroupInterjectionModel.update({
                    Title: interjectionTitle,
                    Description: interjectionDescription,
                    Icon: interjectionIcon,
                    TextColor: interjectionTextColor,
                    BackgroundColor: interjectionBackgroundColor,
                    IncludeCaptionist: interjectionCaptionist,
                    IncludeInterpreter: interjectionInterpreter,
                    Position: interjectionPosition,
                    groupID: groupId,
					Sound: interjectionSound
                }, {
                    where: {
                        ID: interjectionId
                    }
                }).then(function (data) {
                    response.send({success: true, interjection: data});
                });
            },


            sendInterjection: function (request, response) {
                var groupId = request.body.GroupId;
                var userId = request.body.UserId;
                var interjectionId = request.body.InterjectionId;

               console.log("---------------");
                var io = global.io;
                var socket = global.clients[userId];
                if (socket != undefined){
                    socket.broadcast.in(groupId).emit('interjection',interjectionId);
                    console.log("interjection sent");
                }
                else
                {
                    console.log("socket undefined");
                }
            }

        };

        module.exports = {
            init: init
        };

    }()
);
