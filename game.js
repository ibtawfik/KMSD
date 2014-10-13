'use strict';

angular.module('myApp', ['ngTouch'])
  .controller('Ctrl', function (
      $window, $scope, $log, $timeout,
      gameService, scaleBodyService, gameLogic) {

    /*
    Audio
    */

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

      /*
      Play audio
      */

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

                            isOrangePiece: false,
                            isBluePiece: false,
                            isPurplePiece: false,
                            isPinkPiece: false,
                            isYellowPiece: false,
                            isRedPiece: false,
                            isGreenPiece: false,
                            isBrownPiece: false,
                            piece: '',

                            color: '',

                            isEmpty: true,
                            isSelected: false,
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
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].isOrangePiece = true; break;
            case 'BL': $scope.uiBoard[r][c].isBluePiece = true; break;
            case 'PU': $scope.uiBoard[r][c].isPurplePiece = true; break;
            case 'PI': $scope.uiBoard[r][c].isPinkPiece = true; break;
            case 'YE': $scope.uiBoard[r][c].isYellowPiece = true; break;
            case 'RE': $scope.uiBoard[r][c].isRedPiece = true; break;
            case 'GR': $scope.uiBoard[r][c].isGreenPiece = true; break;
            case 'BR': $scope.uiBoard[r][c].isBrownPiece = true; break;
          }
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].piece = 'img/white_orange'; break;
            case 'BL': $scope.uiBoard[r][c].piece = 'img/white_blue'; break;
            case 'PU': $scope.uiBoard[r][c].piece = 'img/white_purple'; break;
            case 'PI': $scope.uiBoard[r][c].piece = 'img/white_pink'; break;
            case 'YE': $scope.uiBoard[r][c].piece = 'img/white_yellow'; break;
            case 'RE': $scope.uiBoard[r][c].piece = 'img/white_red'; break;
            case 'GR': $scope.uiBoard[r][c].piece = 'img/white_green'; break;
            case 'BR': $scope.uiBoard[r][c].piece = 'img/white_brown'; break;
          }
        }
      }
      for (piece in $scope.pieces[1]) {
        if ($scope.pieces[1].hasOwnProperty(piece)) {
          r = $scope.pieces[1][piece][0];
          c = $scope.pieces[1][piece][1];
          $scope.uiBoard[r][c].isEmpty = false;
          $scope.uiBoard[r][c].isPlayer1 = true;
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].isOrangePiece = true; break;
            case 'BL': $scope.uiBoard[r][c].isBluePiece = true; break;
            case 'PU': $scope.uiBoard[r][c].isPurplePiece = true; break;
            case 'PI': $scope.uiBoard[r][c].isPinkPiece = true; break;
            case 'YE': $scope.uiBoard[r][c].isYellowPiece = true; break;
            case 'RE': $scope.uiBoard[r][c].isRedPiece = true; break;
            case 'GR': $scope.uiBoard[r][c].isGreenPiece = true; break;
            case 'BR': $scope.uiBoard[r][c].isBrownPiece = true; break;
          }
          switch(piece) {
            case 'OR': $scope.uiBoard[r][c].piece = 'img/black_orange'; break;
            case 'BL': $scope.uiBoard[r][c].piece = 'img/black_blue'; break;
            case 'PU': $scope.uiBoard[r][c].piece = 'img/black_purple'; break;
            case 'PI': $scope.uiBoard[r][c].piece = 'img/black_pink'; break;
            case 'YE': $scope.uiBoard[r][c].piece = 'img/black_yellow'; break;
            case 'RE': $scope.uiBoard[r][c].piece = 'img/black_red'; break;
            case 'GR': $scope.uiBoard[r][c].piece = 'img/black_green'; break;
            case 'BR': $scope.uiBoard[r][c].piece = 'img/black_brown'; break;
          }
        }
      }

      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 500);
      }
    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

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
        //if the player is not allowed to make the second click, then this is the first click
        if (!$scope.canMakeSecondClick) {
          $scope.firstClick(row,col);
          return;
        }
        //if the player is allowed to make the second click, then this is the second click
        else if ($scope.canMakeSecondClick) {
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

      //choose the pieceColor for createMove
      try {
        $scope.pieceColor = '';

        if ($scope.uiBoard[row][col].isOrangePiece) {
          $scope.pieceColor = 'OR';
        }
        else if ($scope.uiBoard[row][col].isBluePiece) {
          $scope.pieceColor = 'BL';
        }
        else if ($scope.uiBoard[row][col].isRedPiece) {
          $scope.pieceColor = 'RE';
        }
        else if ($scope.uiBoard[row][col].isYellowPiece) {
          $scope.pieceColor = 'YE';
        }
        else if ($scope.uiBoard[row][col].isGreenPiece) {
          $scope.pieceColor = 'GR';
        }
        else if ($scope.uiBoard[row][col].isBrownPiece) {
          $scope.pieceColor = 'BR';
        }
        else if ($scope.uiBoard[row][col].isPurplePiece) {
          $scope.pieceColor = 'PU';
        }
        else if ($scope.uiBoard[row][col].isPinkPiece) {
          $scope.pieceColor = 'PI';
        }

        //successfully select a piece and mark it as selected
        $scope.uiBoard[row][col].isSelected = true;
        selectedPiece[0] = $scope.uiBoard[row][col];

        //after successfully making the first click, the player is allowed to make the second click
        $scope.canMakeSecondClick = true;

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
        // TODO: show animations and only then send makeMove.
        gameService.makeMove(move);
      } catch (e) {
        //if a player fails to make a valid second click, he has to start again from the first click
        $scope.canMakeSecondClick = false;
        return;
      }
    };

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