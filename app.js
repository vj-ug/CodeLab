'use strict';

var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  })
  .when('/student', {
    templateUrl: 'main_student.html',
    controller: 'StudentCtrl',
    resolve: {
      USER: function() { return 'STUDENT'; }
    }
  })
  .when('/teacher', {
    templateUrl: 'main.html',
    controller: 'StudentCtrl',
    resolve: {
      USER: function() { return 'TEACHER'; }
    }
  })
  // .when('/about', {
  //   templateUrl: 'about.html',
  //   controller: 'AboutCtrl'
  // })
  .otherwise({
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  });
  // $locationProvider.html5Mode(true);
}]);

app.run(function($rootScope) {
  $(document).ready(function() {
    $('.dropdown-button').dropdown({"hover": false});
    // if (window_width > 600) {
    //   $('ul.tabs').tabs();
    // }
    // else {
    //   $('ul.tabs').hide();
    // }
    $('.tab-demo').show().tabs();
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('.tooltipped').tooltip({"delay": 45});
    $('.collapsible-accordion').collapsible();
    $('.collapsible-expandable').collapsible({"accordion": false});
    $('.materialboxed').materialbox();
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav();
  });
});

app.controller('HomeCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
  $rootScope.root = {
    title: 'Home'
  };

  // Github Latest Commit
  if ($('#lastUpdated').length) { // Checks if widget div exists (Index only)
    $.ajax({
      url: "https://api.github.com/repos/sonph/hackutds15/commits/gh-pages",
      dataType: "json",
      success: function (data) {
        var sha = data.sha;
        var date = jQuery.timeago(data.commit.author.date);
        // if (window_width < 600) {
        //   sha = sha.substring(0,7);
        // }
        // $('.github-commit').find('.date').html(date);
        $('#lastUpdated').html(date);
        //$('.github-commit').find('.sha').html(sha).attr('href', data.html_url);
        // $('.github-commit').find('.sha').html(sha.substring(0, 7));

        // console.log(returndata, returndata.commit.author.date, returndata.sha);
      }
    });
  }

  var window_width = $(window).width;

  $('.dropdown-button').dropdown({"hover": false});
  if (window_width > 600) {
    $('ul.tabs').tabs();
  }
  else {
    $('ul.tabs').hide();
  }
  $('.tab-demo').show().tabs();
  $('.parallax').parallax();
  $('.modal-trigger').leanModal();
  $('.tooltipped').tooltip({"delay": 45});
  $('.collapsible-accordion').collapsible();
  $('.collapsible-expandable').collapsible({"accordion": false});
  $('.materialboxed').materialbox();
  $('.scrollspy').scrollSpy();
  $(document).ready(function() {
    $('.button-collapse').sideNav();
  });

}]);


// app.controller('AboutCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
//   $rootScope.root = {
//     title: 'About'
//   };
// }]);

app.controller('StudentCtrl', ['$scope', '$rootScope', 'USER', function($scope, $rootScope, USER) {
  $scope.USER = USER;

  if (USER == 'STUDENT') {
    $rootScope.root = {
      title: 'Student'
    };
    $scope.YOU = TEACHER_CALL_USER;
    $scope.ME = STUDENT_CALL_USER;
    $scope.chatName = 'Teacher';
    $scope.presenceWatch = [
      {full_user_id: TEACHER_CALL_USER + '@' + DOMAIN_NAME}
    ];
    $('.teacher-only').hide();
  } else {
    $rootScope.root = {
      title: 'Teacher'
    };
    $scope.YOU = STUDENT_CALL_USER;
    $scope.ME = TEACHER_CALL_USER;
    $scope.chatName = 'Student';
    $('.teacher-only').show();
    $('#msg_box').css('margin-top', '375px');
    $('#feedback-buttons').fadeIn();
  }

  var setContactOnline = function(online) {
    $scope.contactOnline = online;
  };

  var sendStudentSMS = function(text) {
    KandyAPI.Phone.sendSMS(
      STUDENT_PHONE_NUMBER,
      'Teacher',
      text,
      function() {
      },
      function() {
        // toast('Failed to send SMS', 4000);
      }
    );
  }

  var sendMsg = function(text) {
    var sendText = '';
    if ($scope.USER == 'STUDENT') {
      if (text == 'hello') {
        sendText = 'hello';
      }
    } else {
      if (text == 'hello') {
        // sendText = '您好';
        sendText = 'hello';
      }
    }

    var uuid = KandyAPI.Phone.sendIm($scope.YOU + '@' + DOMAIN_NAME, text !== undefined ? (sendText != '' ? sendText : text) : $('#chat_box').val(),
      function(result) {
        // toast(JSON.stringify(result), 4000);
        if (text == '#FEEDBACK-GOOD') {
          $('#msg_box').append(
            '<div class="center"><span style="color: #A0A0A0">You have provided <span style="color:#4caf50">good</span> feedback.</span></div>'
          );
          if ($scope.contactOnline == false || $scope.contactOnline == undefined) {
            sendStudentSMS('Good Work.');
          }
        } else if (text == '#FEEDBACK-AVG') {
          $('#msg_box').append(
            '<div class="center"><span style="color: #A0A0A0">You have provided <span style="color:#ffeb3b">average</span> feedback.</span></div>'
          );
          if ($scope.contactOnline == false || $scope.contactOnline == undefined) {
            sendStudentSMS('Average Work.');
          }
        } else if (text == '#FEEDBACK-BAD') {
          $('#msg_box').append(
            '<div class="center"><span style="color: #A0A0A0">You have provided <span style="color:#f44336">bad</span> feedback.</span></div>'
          );
          if ($scope.contactOnline == false || $scope.contactOnline == undefined) {
            sendStudentSMS('Bad Work.');
          }
        } else {
          $('#msg_box').append('<div><span id="msg-' + result.UUID + '" style="color:#ff6868">You: </span>' +
                  '<span>' + $('#chat_box').val() + '</span>' +
                  '</div>');
          $('#chat_box').val('');
        }
      },
      function(message, status) {
        toast('Error: ' + message + ', status: ' + status, 4000);
        $('#msg_box').append('<div><span id="msg-' + result.UUID + '" style="color:#ff6868">You: </span>' +
                  '<span>' + $('#chat_box').val() + '</span><i class="mdi-action-report-problem right"></i>' +
                  '</div>');
          $('#chat_box').val('');
      }
    );
  };

  var getMsg = function() {
    KandyAPI.Phone.getIm(function(data) {
      for (var iter = 0; iter < data.messages.length; iter++) {
        var msg = data.messages[iter];

        // take a look at the message
        // toast(JSON.stringify(msg), 4000);
        // window.prompt('message:', JSON.stringify(msg));

        if (msg.messageType == 'chat') {
          var username = msg.sender.user_id;

            // TODO : if the logged in user is a teacher and the user he/she is chatting with
            // is not the sender, open a toast saying another student has sent him/her a message
            // toast('User id: ' + msg.sender.user_id, 4000);

          if (username == $scope.YOU) {
            // TODO : delete previous messages to limit the number of displayed messages?
            // or add scroll bar
            if (msg.contentType == 'text') {
              if (msg.message.text == '#FEEDBACK-GOOD') {
                $('#msg_box').append(
                  '<div class="center"><span style="color: #A0A0A0">Teacher has provided <span style="color:#4caf50">good</span> feedback.</div>'
                );
                toast('Teacher has provided good feedback.', 4000);
              } else if (msg.message.text == '#FEEDBACK-AVG') {
                $('#msg_box').append(
                  '<div class="center"><span style="color: #A0A0A0">Teacher has provided <span style="color:#ffeb3b">average</span> feedback.</div>'
                );
                toast('Teacher has provided average feedback.', 4000);
              } else if (msg.message.text == '#FEEDBACK-BAD') {
                $('#msg_box').append(
                  '<div class="center"><span style="color: #A0A0A0">Teacher has provided <span style="color:#f44336">bad</span> feedback.</div>'
                );
                toast('Teacher has provided bad feedback.', 4000);
              } else {
                var mess = msg.message.text;
                if ($scope.USER == 'STUDENT') {
                  if (mess == 'hello') {
                    mess = 'hello';
                  }
                } else {
                  if (mess == 'hello') {
                    mess = 'hello';
                  }
                }
                $('#msg_box').append('<div><span style="color:#68a9ff">' + $scope.chatName + ': </span><span>' + mess + '</span></div>');
              }
            } else if (msg.contentType == 'file') {

              var content_uuid = msg.message.content_uuid;

              // TODO: ask kandy guys that the thumbnail link is broken
              var fileURL = KandyAPI.Phone.buildFileUrl(content_uuid);
              var thumbnailURL = KandyAPI.Phone.buildFileThumbnailUrl(content_uuid);
              $('#msg_box').append(
                '<div><span style="color:#68a9ff">' + $scope.chatName + ': </span><img class="materialboxed message-img" src="' + thumbnailURL + '"></div></div>'
              );
            }

          } else {
            console.debug(msg.sender.user_id);
          }
        } else if (msg.messageType == 'chatRemoteAck') {
          // add seen checkmark
          $('#msg-' + msg.UUID).after('<i class="mdi-action-done right"></i>')
        } else {
          console.debug(msg.messageType);
          // toast('Msg type: ' + msg.messageType, 4000);

        }
      } // END loop
    }, function() { alert("error loading message"); });
  }

  $(document).ready(function() {
    $('.tooltipped').tooltip({delay: 50});
    $('.materialboxed').materialbox();

    // setup editor
    // var editor = ace.edit("editor");
    // editor.setTheme("ace/theme/xcode");
    // editor.getSession().setMode("ace/mode/javascript");
    // editor.setFontSize(13);
    // editor.$blockScrolling = Infinity;

    // setup kandy video call
    setLogoutOnUnload();
    setup();
    login($scope.ME);
    if ($scope.presenceWatch !== undefined) {
      KandyAPI.Phone.watchPresence($scope.presenceWatch);
    }
    setInterval(getMsg, 3000);

    // setup kandy cobrowsing
    // loginUser();
    // var session = JSON.parse(SESSION);
    // getOpenSessions();
    // leaveSession(session);
    // loadSessionDetails(session);
    // joinSession(session);
    // startCoBrowseAgent(session);


    $('#callBtn').on('click', function () {
      if ($scope.contactOnline == false) {
        if ($scope.USER == 'TEACHER') {
          KandyAPI.Phone.makePSTNCall(STUDENT_PHONE_NUMBER, 'Teacher');
        } else {
          KandyAPI.Phone.makePSTNCall(TEACHER_PHONE_NUMBER, 'Student');
        }
      } else {
        makeCall($scope.YOU);
      }
    });
    $('#answerVideoCallBtn').on('click', answerVideoCall);
    $('#rejectCallBtn').on('click', rejectCall);
    $('#hangUpCallOutBtn').on('click', hangUpCall);
    $('#holdBtn').on('click', holdCall);
    $('#unholdBtn').on('click', unholdCall);
    $('#hangUpBtn').on('click', hangUpCall);

    $('#input-file').on('change', function() {
      toast('You chose a file', 4000);
      var file = document.getElementById("input-file").files[0];
      $scope.fileUUID = KandyAPI.Phone.sendImWithFile($scope.YOU + '@' + DOMAIN_NAME, file,
        function(content_uuid) {  // success function
            // YOUR CODE GOES HERE
          // toast(content_uuid, 4000);
          var fileURL = KandyAPI.Phone.buildFileUrl(content_uuid);
          var thumbnailURL = KandyAPI.Phone.buildFileThumbnailUrl(content_uuid);

          // TODO: ask Kandy guy: link is broken
          $('#msg_box').append(
            '<div id="msg-' + content_uuid + '"><span style="color:#ff6868">You: </span><img class="materialboxed message-img" src="' + thumbnailURL + '"></div></div>'
          );
        },
        function() {
          toast('Failed to send file', 4000);
        }
      );
    });

    $('#chat_box').on('keypress', function() {
      if (window.event.keyCode == 13) {
        sendMsg();
      }
    });

    $('#feedback-good').on('click', function() {
      sendMsg('#FEEDBACK-GOOD');
    });

    $('#feedback-avg').on('click', function() {
      sendMsg('#FEEDBACK-AVG');
    });

    $('#feedback-bad').on('click', function() {
      sendMsg('#FEEDBACK-BAD');
    });
  });
}]);
