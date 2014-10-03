'use strict';

// TODO: remove stateService before launching the game.
angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, stateService, gameLogic) {

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.pieces = params.stateAfterMove.pieces;
      $scope.board = [[ {color: 'orange', piece:''}, {color: 'blue', piece:''}, {color: 'purple', piece:''}, {color: 'pink', piece:''}, {color: 'yellow', piece:''}, {color: 'red', piece:''}, {color: 'green', piece:''}, {color: 'brown', piece:''} ],
                      [ {color: 'red', piece:''}, {color: 'orange', piece:''}, {color: 'pink', piece:''}, {color: 'green', piece:''}, {color: 'blue', piece:''}, {color: 'yellow', piece:''}, {color: 'brown', piece:''}, {color: 'purple', piece:''} ],
                      [ {color: 'green', piece:''}, {color: 'pink', piece:''}, {color: 'orange', piece:''}, {color: 'red', piece:''}, {color: 'purple', piece:''}, {color: 'brown', piece:''}, {color: 'yellow', piece:''}, {color: 'blue', piece:''} ],
                      [ {color: 'pink', piece:''}, {color: 'purple', piece:''}, {color: 'blue', piece:''}, {color: 'orange', piece:''}, {color: 'brown', piece:''}, {color: 'green', piece:''}, {color: 'red', piece:''}, {color: 'yellow', piece:''} ],
                      [ {color: 'yellow', piece:''}, {color: 'red', piece:''}, {color: 'green', piece:''}, {color: 'brown', piece:''}, {color: 'orange', piece:''}, {color: 'blue', piece:''}, {color: 'purple', piece:''}, {color: 'pink', piece:''} ],
                      [ {color: 'blue', piece:''}, {color: 'yellow', piece:''}, {color: 'brown', piece:''}, {color: 'purple', piece:''}, {color: 'red', piece:''}, {color: 'orange', piece:''}, {color: 'pink', piece:''}, {color: 'green', piece:''} ],
                      [ {color: 'purple', piece:''}, {color: 'brown', piece:''}, {color: 'yellow', piece:''}, {color: 'blue', piece:''}, {color: 'green', piece:''}, {color: 'pink', piece:''}, {color: 'orange', piece:''}, {color: 'red', piece:''} ],
                      [ {color: 'brown', piece:''}, {color: 'green', piece:''}, {color: 'red', piece:''}, {color: 'yellow', piece:''}, {color: 'pink', piece:''}, {color: 'purple', piece:''}, {color: 'blue', piece:''}, {color: 'orange', piece:''} ]];
      if ($scope.pieces === undefined) {
        $scope.pieces = [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                         {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}];
      }
      var piece,
        row,
        col;
      for (piece in $scope.pieces[0]) {
        if ($scope.pieces[0].hasOwnProperty(piece)) {
          row = $scope.pieces[0][piece][0];
          col = $scope.pieces[0][piece][1];
          $scope.board[row][col].piece = piece+0;
        }
      }
      for (piece in $scope.pieces[1]) {
        if ($scope.pieces[1].hasOwnProperty(piece)) {
          row = $scope.pieces[1][piece][0];
          col = $scope.pieces[1][piece][1];
          $scope.board[row][col].piece = piece+1;
        }
      }
    }

    updateUI({stateAfterMove: {}});
    var game = {
      gameDeveloperEmail: "rshen1993@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles()
    };

    var isLocalTesting = $window.parent === $window;
    $scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]}, {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}}, {set: {key: 'board', value: [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],[ '', '', '', '', '', '', '', '' ],[ '', '', '', '', '', '', '', '' ],[ '', '', '', 'T', '', '', '', '' ],[ '', '', '', '', '', '', '', '' ],[ '', '', '', '', '', '', '', '' ],[ '', '', '', '', '', '', '', '' ],[ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}}, {set: {key: 'delta', value: {color: 'YE', row: 3, col: 3}}}]";
    $scope.makeMove = function () {
      $log.info(["Making move:", $scope.move]);
      var moveObj = eval($scope.move);
      if (isLocalTesting) {
        stateService.makeMove(moveObj);
      } else {
        messageService.sendMessage({makeMove: moveObj});
      }
    };

    if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });

      messageService.sendMessage({gameReady : game});
    }
  });
