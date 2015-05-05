'use strict';

angular.module('myApp', ['ngDraggable','ngTouch','ui.bootstrap'])
  .controller('Ctrl', function (
      $window, $scope, $log, $timeout,
      gameService, gameLogic,resizeGameAreaService) {
      resizeGameAreaService.setWidthToHeight(1);

    function sendComputerMove() {
      var r = $scope.state.delta.row,
        c = $scope.state.delta.col,
        color = gridColors[r][c];
      var move = gameLogic.createComputerMove($scope.state, color, $scope.turnIndex),//create the move to be made
        //information needed to create animation
        prev_row = $scope.pieces[$scope.turnIndex][color][0],
        prev_col = $scope.pieces[$scope.turnIndex][color][1],
        delta = move[3].set.value,
        curr_row = delta.row,
        curr_col = delta.col;

      //create animation
      $scope.uiBoard[prev_row][prev_col].ngstyle = getngstyle(curr_row, curr_col, prev_row, prev_col);

      //wait for animation to be played
      $timeout(function(){gameService.makeMove(move);},500);
    }


    $scope.getWidth = function(){
        var gameArea = document.getElementById("gameArea");
        return gameArea.style.width * .125;
    };

    $scope.getHeight = function(){
        var gameArea = document.getElementById("gameArea");
        return gameArea.style.height * .125;
    };

    $scope.getTop = function(row){

        var gameArea = document.getElementById("gameArea");
        return gameArea.style.height * .125 * row;
    };

    $scope.getLeft = function(column){
        var gameArea = document.getElementById("gameArea");
        return gameArea.style.width * .125 * column;
    };


        var gridColors = [
      [ 'OR', 'BL', 'PU', 'PI', 'YE', 'RE', 'GR', 'BR' ],
      [ 'RE', 'OR', 'PI', 'GR', 'BL', 'YE', 'BR', 'PU' ],
      [ 'GR', 'PI', 'OR', 'RE', 'PU', 'BR', 'YE', 'BL' ],
      [ 'PI', 'PU', 'BL', 'OR', 'BR', 'GR', 'RE', 'YE' ],
      [ 'YE', 'RE', 'GR', 'BR', 'OR', 'BL', 'PU', 'PI' ],
      [ 'BL', 'YE', 'BR', 'PU', 'RE', 'OR', 'PI', 'GR' ],
      [ 'PU', 'BR', 'YE', 'BL', 'GR', 'PI', 'OR', 'RE' ],
      [ 'BR', 'GR', 'RE', 'YE', 'PI', 'PU', 'BL', 'OR' ]
    ];

    /*
    var selectedPiece = [];

    $scope.canMakeSecondClick = false;
    */

    //convert gameLogic state to UI state
    function updateUI(params) {

      //pieces information, used to create UI state
      $scope.pieces = params.stateAfterMove.pieces;
      if ($scope.pieces === undefined) {
        $scope.pieces = [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                         {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}];
      }
      else {

      }

      //state after the previous move, will be used in this createMove
      $scope.state = params.stateAfterMove;

      //create UI state
      $scope.uiBoard = [[],[],[],[],[],[],[],[]];

      var piece,
        r,
        c;

      //create game board from the gridColors
      for (r = 0; r < 8; r += 1) {
        for (c = 0; c < 8; c += 1){
          var gridColor = gridColors[r][c],
            currSquare = {
                            isPlayer0: false,
                            isPlayer1: false,

                            playerIndex: -1,

                            //color of grid
                            color: '',

                            //color of piece
                            pieceColor: '',

                            //unique id of pieces
                            id: -1,

                            isEmpty: true,
                            /*
                            isSelected: false,
                            */
                            isDraggable: false,

                            ngstyle: {},

                            row: -1,
                            col: -1
                          };

          currSquare.row = r;
          currSquare.col = c;

          //background colors of grids
          switch(gridColor) {
            case 'OR': currSquare.color = 'FFA858'; break;
            case 'BL': currSquare.color = '39455A'; break;
            case 'PU': currSquare.color = '890E53'; break;
            case 'PI': currSquare.color = 'AC768F'; break;
            case 'YE': currSquare.color = 'EAC761'; break;
            case 'RE': currSquare.color = 'F75E50'; break;
            case 'GR': currSquare.color = '84A586'; break;
            case 'BR': currSquare.color = 'A26E59'; break;
          }

          $scope.uiBoard[r][c] = currSquare;
        }
      }

      //add pieces to game board by reading from pieces
      var i = 0;
      for (piece in $scope.pieces[0]) {
        if ($scope.pieces[0].hasOwnProperty(piece)) {
          r = $scope.pieces[0][piece][0];
          c = $scope.pieces[0][piece][1];
          $scope.uiBoard[r][c].isEmpty = false;
          $scope.uiBoard[r][c].isPlayer0 = true;
          $scope.uiBoard[r][c].playerIndex = 0;
          $scope.uiBoard[r][c].pieceColor = piece;
          $scope.uiBoard[r][c].id = i;
          i = i + 1;
        }
      }
      i = 10;
      for (piece in $scope.pieces[1]) {
        if ($scope.pieces[1].hasOwnProperty(piece)) {
          r = $scope.pieces[1][piece][0];
          c = $scope.pieces[1][piece][1];
          $scope.uiBoard[r][c].isEmpty = false;
          $scope.uiBoard[r][c].isPlayer1 = true;
          $scope.uiBoard[r][c].playerIndex = 1;
          $scope.uiBoard[r][c].pieceColor = piece;
          $scope.uiBoard[r][c].id = i;
          i = i + 1;
        }
      }


      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

      //if the game is ongoing, update the draggable pieces
      if (params.turnIndexAfterMove >= 0) {
        updateDraggable();
      }

      //if a player has no legal move to make, then automatically make the default move
      if ($scope.state.delta !== undefined && params.turnIndexAfterMove >= 0){
        r = $scope.state.delta.row;
        c = $scope.state.delta.col;
        var color = gridColors[r][c];

        if (gameLogic.noLegalMove($scope.state.board, $scope.pieces, $scope.turnIndex, color)) {
          r = $scope.pieces[$scope.turnIndex][color][0];
          c = $scope.pieces[$scope.turnIndex][color][1];
          var move = [{setTurn: {turnIndex: 1 - $scope.turnIndex}},
              {set: {key: 'pieces', value: $scope.pieces}},
              {set: {key: 'board', value: $scope.state.board}},
              {set: {key: 'delta', value: {color: color,
               row: r, col: c}}}];

          $scope.isYourTurn = false; // to prevent making another move
          gameService.makeMove(move);
        }
      }

      //is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        $timeout(sendComputerMove, 500);
      }
    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

    //callback function handling drag and drop
    $scope.onDropComplete = function (data, event, row, col) {
      //get the color of piece from piece id
      switch(data) {
        case 0: $scope.pieceColor = 'BR'; break;
        case 1: $scope.pieceColor = 'GR'; break;
        case 2: $scope.pieceColor = 'RE'; break;
        case 3: $scope.pieceColor = 'YE'; break;
        case 4: $scope.pieceColor = 'PI'; break;
        case 5: $scope.pieceColor = 'PU'; break;
        case 6: $scope.pieceColor = 'BL'; break;
        case 7: $scope.pieceColor = 'OR'; break;
        case 10: $scope.pieceColor = 'OR'; break;
        case 11: $scope.pieceColor = 'BL'; break;
        case 12: $scope.pieceColor = 'PU'; break;
        case 13: $scope.pieceColor = 'PI'; break;
        case 14: $scope.pieceColor = 'YE'; break;
        case 15: $scope.pieceColor = 'RE'; break;
        case 16: $scope.pieceColor = 'GR'; break;
        case 17: $scope.pieceColor = 'BR'; break;
      }
      try {
        //create move
        var move = gameLogic.createMove($scope.state, row, col, $scope.pieceColor, $scope.turnIndex);
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        return;
      }
    }

    /**
     *
     *functions handling clicking event
     *
     */

    /*
    $scope.cellClicked = function (row, col) {
      //every time you click on a cell, the originally selected piece will be unselected
      if (selectedPiece.length !== 0) {
        selectedPiece[0].isSelected = false;
      }

      $log.info(["Clicked on cell:", row, col]);
      //return if this is not your turn
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        //if clicking on a non-empty cell, then this is the first click
        if (!$scope.uiBoard[row][col].isEmpty) {

          //set all cells to be undroppable before the first click
          unDroppableAll();

          $scope.firstClick(row,col);
          return;
        }
        //otherwise, if the player is allowed to make the second click, then this is the second click
        if ($scope.canMakeSecondClick) {
          $scope.secondClick(row,col);
          return;
        }
      } catch (e) {
        return;
      }
    };

    //the first click, used to determine which piece to move
    $scope.firstClick = function (row, col) {
      //can not select opponent's piece
      if ($scope.turnIndex === 0 && $scope.uiBoard[row][col].isPlayer1) {
        $scope.canMakeSecondClick = false;
        return;
      }
      if ($scope.turnIndex === 1 && $scope.uiBoard[row][col].isPlayer0) {
        $scope.canMakeSecondClick = false;
        return;
      }

      //can only select the correct color
      if ($scope.state.delta !== undefined) {
        var r = $scope.state.delta.row,
          c = $scope.state.delta.col,
          gridColor = gridColors[r][c];

        if ($scope.uiBoard[row][col].pieceColor !== gridColor) {
          return;
        }
      }

      //choose the pieceColor for createMove
      try {
        $scope.pieceColor = $scope.uiBoard[row][col].pieceColor;

        //successfully select a piece and mark it as selected
        $scope.uiBoard[row][col].isSelected = true;
        selectedPiece[0] = $scope.uiBoard[row][col];

        //after successfully making the first click, the player is allowed to make the second click
        $scope.canMakeSecondClick = true;

        //update the droppable target cells based on the piece selected
        updateDroppable(row,col);

        $scope.prev_row = row;
        $scope.prev_col = col;

      } catch (e) {
        $scope.canMakeSecondClick = false;
        return;
      }
    };

    //the second click, used to determine the target cell and make move
    $scope.secondClick = function (row, col) {
      try {
        //create move
        var move = gameLogic.createMove($scope.state, row, col, $scope.pieceColor, $scope.turnIndex);
        $scope.canMakeSecondClick = false;
        $scope.isYourTurn = false; // to prevent making another move
        //$scope.uiBoard[$scope.prev_row][$scope.prev_col].ngstyle = playAnimation(row, col);
        gameService.makeMove(move);
      } catch (e) {
        //if a player fails to make a valid second click, he has to start again from the first click
        $scope.canMakeSecondClick = false;
        return;
      }
    };
    */

    //update if pieces are draggable based on rule
    function updateDraggable () {
      //opponent has made move and movable color is limited
      if ($scope.state.delta !== undefined) {
        var r = $scope.state.delta.row,
          c = $scope.state.delta.col,
          gridColor = gridColors[r][c];

        var row = $scope.pieces[$scope.turnIndex][gridColor][0],
          col = $scope.pieces[$scope.turnIndex][gridColor][1];
        $scope.uiBoard[row][col].isDraggable = true;
      }
      //game just started
      else {
        var row,
          col;
        if ($scope.turnIndex === 0) {
          row = 7;
        }
        else {
          row = 0;
        }
        for (col = 0; col < 8; col = col + 1) {
          $scope.uiBoard[row][col].isDraggable = true;
        }
      }
    }

    //function used to create animation
    function getngstyle (curr_row, curr_col, row, col) {
      var left = (curr_col - col) * 30 + "px",
        top = (curr_row - row) * 30 + "px";
      return {top: top, left: left, position: "relative",
              "-webkit-animation": "moveAnimation 0.5s",
              "animation": "moveAnimation 0.5s"};
    }

    gameService.setGame({
      gameDeveloperEmail: "rshen1993@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  });