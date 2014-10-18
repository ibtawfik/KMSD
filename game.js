'use strict';

angular.module('myApp', ['ngTouch'])
  .controller('Ctrl', function (
      $window, $scope, $log, $timeout,
      gameService, scaleBodyService, gameLogic) {

    var moveAudio = new Audio('audio/move.wav');
    moveAudio.load();

    function sendComputerMove() {
      var row = $scope.state.delta.row,
        col = $scope.state.delta.col,
        color = gridColors[row][col];
      gameService.makeMove(gameLogic.createComputerMove($scope.state, color, $scope.turnIndex));
    }

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

    var selectedPiece = [];

    $scope.canMakeSecondClick = false;

    //convert gameLogic state to UI state
    function updateUI(params) {
      //pieces information, used to create UI state
      $scope.pieces = params.stateAfterMove.pieces;
      if ($scope.pieces === undefined) {
        $scope.pieces = [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                         {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}];
      }
      else {
        moveAudio.play();
      }

      //state after the previous move, will used in this createMove
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

                            //image path
                            piece: '',

                            //color of grid
                            color: '',

                            //color of piece
                            pieceColor: '',

                            isEmpty: true,
                            isSelected: false,
                            isDroppable: false,
                            row: -1,
                            col: -1
                          };

          currSquare.row = r;
          currSquare.col = c;

          switch(gridColor) {
            case 'OR': currSquare.color = 'orange'; break;
            case 'BL': currSquare.color = 'blue'; break;
            case 'PU': currSquare.color = 'purple'; break;
            case 'PI': currSquare.color = 'pink'; break;
            case 'YE': currSquare.color = 'yellow'; break;
            case 'RE': currSquare.color = 'red'; break;
            case 'GR': currSquare.color = 'green'; break;
            case 'BR': currSquare.color = 'brown'; break;
          }

          $scope.uiBoard[r][c] = currSquare;
        }
      }

      //add pieces to game board by reading from pieces
      for (piece in $scope.pieces[0]) {
        if ($scope.pieces[0].hasOwnProperty(piece)) {
          r = $scope.pieces[0][piece][0];
          c = $scope.pieces[0][piece][1];
          $scope.uiBoard[r][c].isEmpty = false;
          $scope.uiBoard[r][c].isPlayer0 = true;
          $scope.uiBoard[r][c].pieceColor = piece;
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].piece = 'img/white_orange';
                       break;
            case 'BL': $scope.uiBoard[r][c].piece = 'img/white_blue';
                       break;
            case 'PU': $scope.uiBoard[r][c].piece = 'img/white_purple'; 
                       break;
            case 'PI': $scope.uiBoard[r][c].piece = 'img/white_pink'; 
                       break;
            case 'YE': $scope.uiBoard[r][c].piece = 'img/white_yellow'; 
                       break;
            case 'RE': $scope.uiBoard[r][c].piece = 'img/white_red'; 
                       break;
            case 'GR': $scope.uiBoard[r][c].piece = 'img/white_green'; 
                       break;
            case 'BR': $scope.uiBoard[r][c].piece = 'img/white_brown'; 
                       break;
          }
        }
      }
      for (piece in $scope.pieces[1]) {
        if ($scope.pieces[1].hasOwnProperty(piece)) {
          r = $scope.pieces[1][piece][0];
          c = $scope.pieces[1][piece][1];
          $scope.uiBoard[r][c].isEmpty = false;
          $scope.uiBoard[r][c].isPlayer1 = true;
          $scope.uiBoard[r][c].pieceColor = piece;
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].piece = 'img/black_orange';
                       break;
            case 'BL': $scope.uiBoard[r][c].piece = 'img/black_blue';
                       break;
            case 'PU': $scope.uiBoard[r][c].piece = 'img/black_purple'; 
                       break;
            case 'PI': $scope.uiBoard[r][c].piece = 'img/black_pink'; 
                       break;
            case 'YE': $scope.uiBoard[r][c].piece = 'img/black_yellow'; 
                       break;
            case 'RE': $scope.uiBoard[r][c].piece = 'img/black_red'; 
                       break;
            case 'GR': $scope.uiBoard[r][c].piece = 'img/black_green'; 
                       break;
            case 'BR': $scope.uiBoard[r][c].piece = 'img/black_brown'; 
                       break;
          }
        }
      }

      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

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

      // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 500);
      }
    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

    $scope.drag = function (event, ui, cell) {
      $scope.cellClicked(cell.row, cell.col);
    }

    $scope.drop = function (event, ui, cell) {
      $scope.cellClicked(cell.row, cell.col);
    }

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
          //set all cells to be undroppable after a second click, no matter successful or not
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

        //update the droppable target cells
        updateDroppable(row,col);

      } catch (e) {
        console.log(e);
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
        gameService.makeMove(move);
      } catch (e) {
        //if a player fails to make a valid second click, he has to start again from the first click
        $scope.canMakeSecondClick = false;
        return;
      }
    };

    function updateDroppable(currRow, currCol) {
      var l = true,
      f = true,
      r = true,
      i = 0,
      row,
      col;

      while (l || f || r) {
        if ($scope.turnIndex === 0) {
          i = i - 1;
        }
        else {
          i = i + 1;
        }
        if (l) {
          row = currRow + i;
          col = currCol + i;
          try {
            gameLogic.createMove($scope.state, row, col, $scope.uiBoard[currRow][currCol].pieceColor, $scope.turnIndex);
            $scope.uiBoard[row][col].isDroppable = true;
          }
          catch (e) {
            l = false;
          }
        }
        if (f) {
          row = currRow + i;
          col = currCol;
          try {
            gameLogic.createMove($scope.state, row, col, $scope.uiBoard[currRow][currCol].pieceColor, $scope.turnIndex);
            $scope.uiBoard[row][col].isDroppable = true;
          }
          catch (e) {
            f = false;
          }
        }
        if (r) {
          row = currRow + i;
          col = currCol - i;
          try {
            gameLogic.createMove($scope.state, row, col, $scope.uiBoard[currRow][currCol].pieceColor, $scope.turnIndex);
            $scope.uiBoard[row][col].isDroppable = true;
          }
          catch (e) {
            r = false;
          }
        }
      }
    }

    function unDroppableAll() {
      var r,
        c;

      for (r = 0; r < 8; r += 1) {
        for (c = 0; c < 8; c += 1){
          $scope.uiBoard[r][c].isDroppable = false;
        }
      }
    }

    /*
    Functions for animations
    */

    scaleBodyService.scaleBody({width: 400, height: 400});

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