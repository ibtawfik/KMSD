'use strict';

angular.module('myApp').service('gameLogic', function () {

  /**
   *
   *Game board with colors of each grid
   *
   */
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

  function isEqual(object1, object2) {
    return angular.equals(object1, object2);
  }

  function copyObject(object) {
    return angular.copy(object);
  }

  /**
   *
   *Player win by getting one of their pieces to the opponent's end of the board
   *
   */
  function getWinner(pieces) {
    var color;
    for (color in pieces[0]) {
      if (pieces[0].hasOwnProperty(color)) {
        if (pieces[0][color][0] === 0) {
          return '0';
        }
      }
    }
    for (color in pieces[1]) {
      if (pieces[1].hasOwnProperty(color)) {
        if (pieces[1][color][0] === 7) {
          return '1';
        }
      }
    }
    return '';
  }

  /**
   *
   *Computer generate a random legal move
   *
   */
  function createComputerMove(stateBeforeMove, pieceColor, turnIndexBeforeMove) {
    var possibleMoves = [],
      pieces = stateBeforeMove.pieces,
      board = stateBeforeMove.board,
      currRow = pieces[turnIndexBeforeMove][pieceColor][0],
      currCol = pieces[turnIndexBeforeMove][pieceColor][1],
      row,
      col;

    //if the computer has no legal move, return the default move
    if (noLegalMove(board, pieces, turnIndexBeforeMove, pieceColor)) {
      return [{setTurn: {turnIndex: 1 - turnIndexBeforeMove}},
            {set: {key: 'pieces', value: pieces}},
            {set: {key: 'board', value: board}},
            {set: {key: 'delta', value: {color: pieceColor,
             row: currRow, col: currCol}}}];
    }

    var l = true,
      f = true,
      r = true,
      i = 0;

    //create all possible moves
    while (l || f || r) {
      if (turnIndexBeforeMove === 0) {
        i = i - 1;
      }
      else {
        i = i + 1;
      }
      if (l) {
        row = currRow + i;
        col = currCol + i;
        try {
          possibleMoves.push(createMove(stateBeforeMove, row, col, pieceColor, turnIndexBeforeMove));
        }
        catch (e) {
          l = false;
        }
      }
      if (f) {
        row = currRow + i;
        col = currCol;
        try {
          possibleMoves.push(createMove(stateBeforeMove, row, col, pieceColor, turnIndexBeforeMove));
        }
        catch (e) {
          f = false;
        }
      }
      if (r) {
        row = currRow + i;
        col = currCol - i;
        try {
          possibleMoves.push(createMove(stateBeforeMove, row, col, pieceColor, turnIndexBeforeMove));
        }
        catch (e) {
          r = false;
        }
      }
    }

    //get a random move from all possible moves
    var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return randomMove;
  }

  /**
   *
   *Create move base on the information submitted by player
   *
   */
  function createMove(stateBeforeMove, row, col, pieceColor, turnIndexBeforeMove) {
    var pieces = stateBeforeMove.pieces;
    if (pieces === undefined) {
        pieces = [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                  {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}
                  ];
    }

    var board = stateBeforeMove.board;
    if (board === undefined) {
      board = [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
               [ '', '', '', '', '', '', '', '' ],
               [ '', '', '', '', '', '', '', '' ],
               [ '', '', '', '', '', '', '', '' ],
               [ '', '', '', '', '', '', '', '' ],
               [ '', '', '', '', '', '', '', '' ],
               [ '', '', '', '', '', '', '', '' ],
               [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ]];
    }

    var deltaPrev = stateBeforeMove.delta,
      gridColor,
      //get the coordinate of the piece before moving
      coordinate = pieces[turnIndexBeforeMove][pieceColor],
      rowPrev = coordinate[0],
      colPrev = coordinate[1];

    //the color of the grid on which the opponent's piece stopped
    //in the previous round
    if (deltaPrev === undefined) {
      gridColor = pieceColor;
    } else {
      gridColor = gridColors[deltaPrev.row][deltaPrev.col];
    }

    //check for the case where a player has no legal move
    if (noLegalMove(board, pieces, turnIndexBeforeMove, gridColor)) {
      if (row === rowPrev && col === colPrev && pieceColor === gridColor) {
        return [{setTurn: {turnIndex: 1 - turnIndexBeforeMove}},
            {set: {key: 'pieces', value: pieces}},
            {set: {key: 'board', value: board}},
            {set: {key: 'delta', value: {color: pieceColor,
             row: row, col: col}}}];
      }
      throw new Error("State changed while there is no legal move");
    }

    //the color of the moving piece must be the same as
    //the color of the grid on which the opponent's piece
    //stopped last round
    if (pieceColor !== gridColor) {
      throw new Error("Must move the piece that has the same color with the grid on which the opponent stoped last round!");
    }

    //can only move straight forward or diagonally forward
    var rowDiff = row - rowPrev,
      colDiff = col - colPrev;
    if (!checkDirection(turnIndexBeforeMove, rowDiff, colDiff)) {
      throw new Error("One can only move a piece straight forward or diagonally forward!");
    }

    //it is not allowed to jump over other pieces
    if (pieceOnPath(board, row, col, rowPrev, colPrev)) {
      throw new Error("It is not allowed to move a piece over another piece");
    }

    var boardAfterMove = copyObject(board),
      piecesAfterMove = copyObject(pieces),
      winner,
      firstOperation;

    boardAfterMove[rowPrev][colPrev] = '';
    boardAfterMove[row][col] = 'T';
    piecesAfterMove[turnIndexBeforeMove][pieceColor] = [row, col];
    winner = getWinner(piecesAfterMove);
    if (winner !== '') {
      firstOperation = {endMatch: {endMatchScores: (winner === '0' ? [1, 0] : [0, 1])}};
    } else {
      firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
    }

    return [firstOperation,
            {set: {key: 'pieces', value: piecesAfterMove}},
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {color: pieceColor,
             row: row, col: col}}}];
  }

  /**
   *
   *Return true if a piece moves forward or diagonally forward
   *
   */
  function checkDirection(turnIndex, rowDiff, colDiff) {
    if (turnIndex === 0) {
      if (rowDiff >= 0) {
        return false;
      }
      if (colDiff === 0 || colDiff === rowDiff || colDiff === -rowDiff) {
        return true;
      }
      return false;
    }
    if (turnIndex === 1) {
      if (rowDiff <= 0) {
        return false;
      }
      if (colDiff === 0 || colDiff === rowDiff || colDiff === -rowDiff) {
        return true;
      }
      return false;
    }
  }

  /**
   *
   *Check if there is any other existing piece on the path that a player tend to move
   *
   */
  function pieceOnPath(board, row, col, rowPrev, colPrev) {
    var i;
    if (col === colPrev) {
      if (row > rowPrev) {
        for (i = rowPrev + 1; i <= row; i = i + 1) {
          if (board[i][col] !== '') {
            return true;
          }
        }
      } else {
        for (i = rowPrev - 1; i >= row; i = i - 1) {
          if (board[i][col] !== '') {
            return true;
          }
        }
      }
    } else {
      if (row > rowPrev) {
        for (i = 1; i <= row - rowPrev; i = i + 1) {
          if (col > colPrev) {
            if (board[rowPrev + i][colPrev + i] !== '') {
              return true;
            }
          }
          if (col < colPrev) {
            if (board[rowPrev + i][colPrev - i] !== '') {
              return true;
            }
          }
        }
      } else if (row < rowPrev) {
        for (i = 1; i <= rowPrev - row; i = i + 1) {
          if (col > colPrev) {
            if (board[rowPrev - i][colPrev + i] !== '') {
              return true;
            }
          }
          if (col < colPrev) {
            if (board[rowPrev - i][colPrev - i] !== '') {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   *
   *Return true if there is no legal move for a player
   *
   */
  function noLegalMove(board, pieces, turnIndexBeforeMove, gridColor) {
    var cor = pieces[turnIndexBeforeMove][gridColor],
      row = cor[0],
      col = cor[1],
      i;
    i = (turnIndexBeforeMove === 0 ? -1 : 1);
    row = row + i;
    if (board[row][col - 1] !== '' && board[row][col] !== '' && board[row][col + 1] !== '') {
      return true;
    }
  }


  function isMoveOk(params) {
    var move = params.move,
      turnIndexBeforeMove = params.turnIndexBeforeMove,
      stateBeforeMove = params.stateBeforeMove;
    try {
      var deltaValue = move[3].set.value,
        pieceColor = deltaValue.color,
        row = deltaValue.row,
        col = deltaValue.col;

      //check if a piece moves out of board
      if (row > 7 || row < 0 || col > 7 || col < 0) {
        return false;
      }

      //create the expected move and check with the input
      var expectedMove = createMove(stateBeforeMove, row, col, pieceColor, turnIndexBeforeMove);
      if (!isEqual(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      //automatically return false if any exception detected
      return false;
    }
    //passed all tests so the move is legal
    return true;
  }

  function getExampleMoves(initialTurnIndex, initialState, arrayOfDeltaAndComment) {
    var exampleMoves = [],
      state = initialState,
      turnIndex = initialTurnIndex;

    for (var i = 0; i < arrayOfDeltaAndComment.length; i = i + 1) {
      var deltaAndComment = arrayOfDeltaAndComment[i],
        row = deltaAndComment.row,
        col = deltaAndComment.col,
        pieceColor = deltaAndComment.color;
        
      var move = createMove(state, row, col, pieceColor, turnIndex);

      exampleMoves.push({
        stateBeforeMove: state,
        turnIndexBeforeMove: turnIndex,
        move: move,
        comment: {en: deltaAndComment.comment}});

      state = {pieces: move[1].set.value, board: move[2].set.value, delta: move[3].set.value};
      turnIndex = 1 - turnIndex;
    }
    return exampleMoves;
  }

  function getRiddles() {
    return [
      getExampleMoves(0, 
                      {pieces: [{BR: [4, 0], GR: [7, 1], RE: [2, 7], YE: [1, 3], PI: [3, 4], PU: [7, 5], BL: [2, 1], OR: [3, 6]},
                                {OR: [0, 0], BL: [1, 1], PU: [0, 2], PI: [4, 1], YE: [3, 7], RE: [1, 6], GR: [6, 6], BR: [2, 5]}],
                       board:  [[ 'T', '', 'T', '', '', '', '', '' ],
                                [ '', 'T', '', 'T', '', '', 'T', '' ],
                                [ '', 'T', '', '', '', 'T', '', 'T' ],
                                [ '', '', '', '', 'T', '', 'T', 'T' ],
                                [ 'T', 'T', '', '', '', '', '', '' ],
                                [ '', '', '', '', '', '', '', '' ],
                                [ '', '', '', '', '', '', 'T', '' ],
                                [ '', 'T', '', '', '', 'T', '', '' ]],
                       delta: {color: 'RE', row: 1, col: 6}},
                       [
                       {color: 'BR', row: 1, col: 0, comment: "player0 moves BROWN piece to [1, 0] which is a red grid, the opponent has only 1 choice"},
                       {color: 'RE', row: 2, col: 6, comment: "player1 has to move RED piece and the only legal move is [2, 6] which is a YELLOW grid and this will lead to a win of player0"},
                       {color: 'YE', row: 0, col: 3, comment: "player0 moves YELLOW piece to [0, 3], which reaches player1's side, so player0 win"}
                       ]),
      getExampleMoves(1,
                      {pieces: [{BR: [1, 0], GR: [3, 5], RE: [4, 5], YE: [7, 3], PI: [4, 7], PU: [7, 5], BL: [1, 6], OR: [2, 4]},
                                {OR: [2, 2], BL: [6, 1], PU: [1, 2], PI: [0, 3], YE: [0, 4], RE: [5, 0], GR: [3, 3], BR: [5, 7]}],
                       board:  [[ '', '', '', 'T', 'T', '', '', '' ],
                                [ 'T', '', 'T', '', '', '', 'T', '' ],
                                [ '', '', 'T', '', 'T', '', '', '' ],
                                [ '', '', '', 'T', '', 'T', '', '' ],
                                [ '', '', '', '', '', 'T', '', 'T' ],
                                [ 'T', '', '', '', '', '', '', 'T' ],
                                [ '', 'T', '', '', '', '', '', '' ],
                                [ '', '', '', 'T', '', 'T', '', '' ]],
                       delta: {color: 'PI', row: 4, col: 7}},
                       [
                       {color: 'PI', row: 2, col: 3, comment: "player1 moves PINK piece to [2, 6] and this gives player0 only 1 choice for RED"},
                       {color: 'RE', row: 3, col: 4, comment: "player0 has to move RED piece and the only possible move is [3, 4], but this will lead to a win of player1"},
                       {color: 'BR', row: 7, col: 7, comment: "player1 moves the BROWN piece to [7, 7] and win the game"}
                       ])
    ];
  }

  function getExampleGame() {
    return getExampleMoves(0, {}, [
      {color: 'RE', row: 3, col: 2, comment: "player0 starts by moving RED piece to [3, 2] which is a BLUE grid"},
      {color: 'BL', row: 6, col: 1, comment: "player1 has to move BLUE piece and he selects [6, 1] to minimizes the move choices of opponent and has a chance to win if BLUE piece can move again"},
      {color: 'BR', row: 2, col: 0, comment: "player0 has to move BROWN piece because last round the opponent stoped on a BRWON grid"},
      {color: 'GR', row: 6, col: 0, comment: "player1 moves GREEN piece to [6, 0] which is a threat to opponent as it could lead to a win"},
      {color: 'PU', row: 3, col: 1, comment: "player0 moves PURPLE piece to [3, 1] which is a PURLE grid"},
      {color: 'PU', row: 3, col: 5, comment: "player1 chooses to move PURPLE piece to [3, 5], which gives the opponent only 3 possible moves"},
      {color: 'GR', row: 4, col: 4, comment: "player0 moves GREEN piece to [4, 4]"},
      {color: 'OR', row: 2, col: 2, comment: "player1 can choose to move to a RED grid or a ORANGE grid, but he has to select ORANGE because player0 could move RED piece to win the game"}
      ]);
  }

  this.noLegalMove = noLegalMove;
  this.createComputerMove = createComputerMove;
  this.createMove = createMove;
  this.isMoveOk = isMoveOk;
  this.getExampleGame = getExampleGame;
  this.getRiddles = getRiddles;
});;'use strict';

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
  });;/**
 * Created by islam on 5/5/15.
 */
angular.module('myApp')
    .service('resizeGameAreaService',
    ['$window', '$log',
        function($window, $log) {

            'use strict';

            var widthToHeight = null;
            var oldSizes = null;
            var doc = $window.document;
            var gameArea;

            function setWidthToHeight(_widthToHeight) {
                widthToHeight = _widthToHeight;
                gameArea = doc.getElementById('gameArea');
                if (!gameArea) {
                    throw new Error("You forgot to add to your <body> this div: <div id='gameArea'>...</div>");
                }
                oldSizes = null;
                rescale();
            }

            function round2(num) {
                return Math.round(num * 100) / 100;
            }

            function rescale() {
                if (widthToHeight === null) {
                    return;
                }
                var originalWindowWidth = $window.innerWidth; // doc.body.clientWidth
                var originalWindowHeight = $window.innerHeight; // I saw cases where doc.body.clientHeight was 0.
                var windowWidth = originalWindowWidth;
                var windowHeight = originalWindowHeight;
                if (oldSizes !== null) {
                    if (oldSizes.windowWidth === windowWidth &&
                        oldSizes.windowHeight === windowHeight) {
                        return; // nothing changed, so no need to change the transformations.
                    }
                }
                oldSizes = {
                    windowWidth: windowWidth,
                    windowHeight: windowHeight
                };

                if (windowWidth === 0 || windowHeight === 0) {
                    $log.info("Window width/height is 0 so hiding gameArea div.");
                    gameArea.style.display = "none";
                    return;
                }
                gameArea.style.display = "block";

                var newWidthToHeight = windowWidth / windowHeight;

                if (newWidthToHeight > widthToHeight) {
                    windowWidth = round2(windowHeight * widthToHeight);
                } else {
                    windowHeight = round2(windowWidth / widthToHeight);
                }
                $log.info("Window size is " + oldSizes.windowWidth + "x" + oldSizes.windowHeight +
                    " so setting gameArea size to " + windowWidth + "x" + windowHeight +
                    " because widthToHeight=" + widthToHeight);

                // Take 5% margin (so the game won't touch the end of the screen)
                var keepMargin = 0.95;
                windowWidth *= keepMargin;
                windowHeight *= keepMargin;
                gameArea.style.width = windowWidth + 'px';
                gameArea.style.height = windowHeight + 'px';
                gameArea.style.position = "absolute";
                gameArea.style.left = ((originalWindowWidth - windowWidth)/2) + 'px';
                gameArea.style.top = ((originalWindowHeight - windowHeight)/2) + 'px';

                window.CIRCLE_WIDTH = windowWidth * 1/8 * .65;
                window.CIRCLE_HEIGHT = windowHeight * 1/8 * .65;
            }

            $window.onresize = rescale;
            $window.onorientationchange = rescale;
            doc.addEventListener("onresize", rescale);
            doc.addEventListener("orientationchange", rescale);
            setInterval(rescale, 1000);

            this.setWidthToHeight = setWidthToHeight;
        }]);;/**
 * Created by islam on 5/5/15.
 */
angular.module('myApp')
    .service('gameService',
    ["$window", "$log", "stateService", "messageService", "$timeout",
        function($window, $log, stateService, messageService, $timeout) {

            'use strict';

            var isLocalTesting = $window.parent === $window ||
                $window.location.search === "?test";

            // We verify that you call makeMove at most once for every updateUI (and only when it's your turn)
            var lastUpdateUI = null;
            function passUpdateUI(updateUI) {
                return function (params) {
                    lastUpdateUI = params;
                    updateUI(params);
                };
            }

            function makeMove(move) {
                $log.info(["Making move:", move]);
                if (!lastUpdateUI) {
                    throw new Error("Game called makeMove before getting updateUI or it called makeMove more than once for a single updateUI.");
                }
                var wasYourTurn = lastUpdateUI.turnIndexAfterMove >= 0 && // game is ongoing
                    lastUpdateUI.yourPlayerIndex === lastUpdateUI.turnIndexAfterMove; // it's my turn
                if (!wasYourTurn) {
                    throw new Error("Game called makeMove when it wasn't your turn: yourPlayerIndex=" + lastUpdateUI.yourPlayerIndex + " turnIndexAfterMove=" + lastUpdateUI.turnIndexAfterMove);
                }
                if (!move || !move.length) {
                    throw new Error("Game called makeMove with an empty move=" + move);
                }
                lastUpdateUI = null; // to make sure you don't call makeMove until you get the next updateUI.

                if (isLocalTesting) {
                    $timeout(function () {
                        stateService.makeMove(move);
                    }, 100);
                } else {
                    messageService.sendMessage({makeMove: move});
                }
            }

            function createPlayersInfo(game) {
                var playersInfo = [];
                for (var i = 0; i < game.maxNumberOfPlayers; i++) {
                    playersInfo.push({playerId : "" + (i + 42)});
                }
                return playersInfo;
            }

            function setGame(game) {
                $window.gameDeveloperEmail = game.gameDeveloperEmail;
                game.updateUI = passUpdateUI(game.updateUI);
                if (isLocalTesting) {
                    stateService.setGame(game);
                } else {
                    var isMoveOk = game.isMoveOk;
                    var updateUI = game.updateUI;

                    messageService.addMessageListener(function (message) {
                        $window.lastMessage = message;
                        if (message.isMoveOk !== undefined) {
                            var isMoveOkResult = isMoveOk(message.isMoveOk);
                            if (isMoveOkResult !== true) {
                                isMoveOkResult = {result: isMoveOkResult, isMoveOk: message.isMoveOk};
                            }
                            messageService.sendMessage({isMoveOkResult: isMoveOkResult});
                        } else if (message.updateUI !== undefined) {
                            lastUpdateUI = message.updateUI;
                            updateUI(message.updateUI);
                        }
                    });

                    // You can't send functions using postMessage.
                    delete game.isMoveOk;
                    delete game.updateUI;
                    messageService.sendMessage({gameReady : game});

                    // Show an empty board to a viewer (so you can't perform moves).
                    $log.info("Passing a 'fake' updateUI message in order to show an empty board to a viewer (so you can NOT perform moves)");
                    updateUI({
                        move : [],
                        turnIndexBeforeMove : 0,
                        turnIndexAfterMove : 0,
                        stateBeforeMove : null,
                        stateAfterMove : {},
                        yourPlayerIndex : -2,
                        playersInfo : createPlayersInfo(game),
                        playMode: "passAndPlay",
                        endMatchScores: null
                    });
                }
            }

            this.makeMove = makeMove;
            this.setGame = setGame;
        }]);;/**
 * Created by islam on 5/5/15.
 */
angular.module('myApp')
    .service('messageService',
    ["$window", "$log", "$rootScope",
        function($window, $log, $rootScope) {

            'use strict';

            var gameUrl = location.toString();
            this.sendMessage = function (message) {
                $log.info("Game sent message", message);
                message.gameUrl = gameUrl;
                $window.parent.postMessage(message, "*");
            };
            this.addMessageListener = function (listener) {
                $window.addEventListener("message", function (event) {
                    var source = event.source;
                    if (source !== $window.parent) {
                        return;
                    }
                    $rootScope.$apply(function () {
                        var message = event.data;
                        $log.info("Game got message", message);
                        listener(message);
                    });
                }, false);
            };
        }])
    .factory('$exceptionHandler',
    ["$window", "$log",
        function ($window, $log) {

            'use strict';

            return function (exception, cause) {
                $log.error("Game had an exception:", exception, cause);
                var exceptionString = angular.toJson({exception: exception, stackTrace: exception.stack, cause: cause, lastMessage: $window.lastMessage}, true);
                var message =
                {
                    emailJavaScriptError:
                    {
                        gameDeveloperEmail: $window.gameDeveloperEmail,
                        emailSubject: "Error in game " + $window.location,
                        emailBody: exceptionString
                    }
                };
                $window.parent.postMessage(message, "*");
                throw exception;
            };
        }]);;/**
 * Created by islam on 5/5/15.
 */
angular.module('myApp')
    .service('stateService',
    ["$window", "$timeout", "$log", "$rootScope",
        function($window, $timeout, $log, $rootScope) {

            'use strict';

            var game;

            var currentState;
            var lastState;
            var currentVisibleTo;
            var lastVisibleTo;
            var lastMove;
            var turnIndexBeforeMove;
            var turnIndex = 0; // turn after the move (-1 when the game ends)
            var endMatchScores = null;
            var setTurnOrEndMatchCount;
            var playersInfo;
            var playMode = location.search === "?onlyAIs" ? "onlyAIs"
                : location.search === "?playAgainstTheComputer" ? "playAgainstTheComputer" : "passAndPlay"; // Default play mode

            var randomSeed;
            var moveNumber;

            // Global settings
            $rootScope.settings = {};
            $rootScope.settings.simulateServerDelayMilliseconds = 0;

            function setPlayMode(_playMode) {
                playMode = _playMode;
                if (game !== undefined) {
                    setPlayers();
                    sendUpdateUi();
                }
            }

            function setRandomSeed(_randomSeed) {
                randomSeed = _randomSeed;
            }

            function setPlayers() {
                playersInfo = [];
                var actualNumberOfPlayers =
                    randomFromTo(game.minNumberOfPlayers, game.maxNumberOfPlayers + 1);
                for (var i = 0; i < actualNumberOfPlayers; i++) {
                    var playerId =
                            playMode === "onlyAIs" ||
                        i !== 0 && playMode === "playAgainstTheComputer" ?
                        "" : // The playerId for the computer is "".
                        "" + (i + 42);
                    playersInfo.push({playerId : playerId});
                }
            }

            function init() {
                if (!game) {
                    throwError("You must call setGame before any other method.");
                }
                setPlayers();
                currentState = {};
                lastState = null;
                currentVisibleTo = {};
                lastVisibleTo = null;
                lastMove = [];
                turnIndexBeforeMove = 0;
                turnIndex = 0; // can be -1 in the last updateUI after the game ended.
                endMatchScores = null;
                moveNumber = 0;
            }

            function startNewMatch() {
                init();
                broadcastUpdateUi();
            }

            //Function to get the keys from a JSON object
            function getKeys(object) {
                var keys = [];
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return keys;
            }

            function clone(obj) {
                return angular.copy(obj);
            }

            function isNull(obj) {
                return obj === undefined || obj === null;
            }

            function throwError() {
                $log.error("Throwing an error with these arguments=", arguments);
                var msg = Array.prototype.join.call(arguments, ", ");
                throw new Error(msg);
            }

            function get(obj, field) {
                if (isNull(obj[field])) {
                    throwError("You must have a field named '", field, "' in this object=", obj);
                }
                return obj[field];
            }

            function getMoveForPlayerIndex(playerIndex, move) {
                var moveForPlayer = [];
                for (var k = 0; k < move.length; k++) {
                    var operation = move[k];
                    if (!isNull(operation.set) &&
                        !isNull(operation.set.visibleToPlayerIndexes) &&
                        operation.set.visibleToPlayerIndexes.indexOf(playerIndex) === -1) {
                        moveForPlayer.push({
                            type : "Set",
                            key : operation.set.key,
                            value : null,
                            visibleToPlayerIndexes : operation.set.visibleToPlayerIndexes
                        });
                    } else {
                        moveForPlayer.push(operation);
                    }
                }
                return moveForPlayer;
            }

            function getStateForPlayerIndex(playerIndex, gameState, visibleTo) {
                if (gameState === null) {
                    return null;
                }
                var result = {};
                var keys = getKeys(gameState);
                for (var k = 0; k < keys.length; k++) {
                    var visibleToPlayerIndexes = visibleTo[keys[k]];
                    var value = null;
                    if (isNull(visibleToPlayerIndexes) || visibleToPlayerIndexes.indexOf(playerIndex) > -1) {
                        value = gameState[keys[k]];
                    }
                    result[keys[k]] = value;
                }
                return result;
            }

            function shuffle(keys) {
                var keysCopy = keys.slice(0);
                var result = [];
                while (keysCopy.length >= 1) {
                    var index = randomFromTo(0, keysCopy.length);
                    var removed = keysCopy.splice(index, 1);
                    result.push(removed);
                }
                return result;
            }

            function randomFromTo(from, to) {
                if (isNull(from) || isNull(to) || from >= to) {
                    throw new Error("In randomFromTo(from,to), you must have from<to, but from=" + from + " to=" + to);
                }
                return Math.floor(Math.random() * (to - from) + from);
            }

            function processApiOperation(operation) {
                //Check for all types of Operations
                var key;
                var op;
                var visibleToPlayerIndexes;
                if (!isNull(operation.set)) {
                    op = operation.set;
                    key = op.key;
                    visibleToPlayerIndexes = op.visibleToPlayerIndexes;
                    var value = op.value;
                    if (isNull(key) || isNull(value)) {
                        throwError("Fields key and value in Set operation must be non null. operation=" + angular.toJson(operation, true));
                    }
                    currentState[key] = value;
                    currentVisibleTo[key] = visibleToPlayerIndexes;
                } else if (!isNull(operation.setTurn)) {
                    op = operation.setTurn;
                    turnIndex = get(op, "turnIndex");
                    setTurnOrEndMatchCount++;
                } else if (!isNull(operation.setRandomInteger)) {
                    op = operation.setRandomInteger;
                    key = op.key;
                    var from = op.from;
                    var to = op.to;
                    if (isNull(key) || isNull(from) || isNull(to)) {
                        throwError("Fields key, from, and to, in SetRandomInteger operation must be non null. operation=" + angular.toJson(operation, true));
                    }
                    var randomValue = randomFromTo(from, to);
                    currentState[key] = randomValue;
                    currentVisibleTo[key] = null;
                } else if (!isNull(operation.setVisibility)) {
                    op = operation.setVisibility;
                    key = op.key;
                    visibleToPlayerIndexes = op.visibleToPlayerIndexes;
                    if (isNull(key)) {
                        throwError("Fields key in SetVisibility operation must be non null. operation=" + angular.toJson(operation, true));
                    }
                    currentVisibleTo[key] = visibleToPlayerIndexes;
                } else if (!isNull(operation['delete'])) {
                    op = operation['delete'];
                    key = op.key;
                    if (isNull(key)) {
                        throwError("Field key in Delete operation must be non null. operation=" + angular.toJson(operation, true));
                    }
                    delete currentState[key];
                    delete currentVisibleTo[key];
                } else if (!isNull(operation.shuffle)) {
                    op = operation.shuffle;
                    var keys = op.keys;
                    if (isNull(keys) || keys.length === 0) {
                        throwError("Field keys in Shuffle operation must be a non empty array. operation=" + angular.toJson(operation, true));
                    }
                    var shuffledKeys = shuffle(keys);
                    var oldGameState = clone(currentState);
                    var oldVisibleTo = clone(currentVisibleTo);
                    for (var j = 0; j < shuffledKeys.length; j++) {
                        var fromKey = keys[j];
                        var toKey = shuffledKeys[j];
                        currentState[toKey] = oldGameState[fromKey];
                        currentVisibleTo[toKey] = oldVisibleTo[fromKey];
                    }
                } else if (!isNull(operation.endMatch)) {
                    op = operation.endMatch;
                    setTurnOrEndMatchCount++;
                    var scores = op.endMatchScores;
                    if (isNull(scores) || scores.length !== playersInfo.length) {
                        throwError("Field scores in EndMatch operation must be an array of the same length as the number of players. operation=" + angular.toJson(operation, true));
                    }
                    endMatchScores = scores;
                    if (playMode === "onlyAIs") {
                        $timeout(startNewMatch, 1000); // start a new match in 1 second.
                    }
                } else {
                    throwError("Illegal operation, it must contain either set, setRandomInteger, setVisibility, delete, shuffle, or endMatch: " + angular.toJson(operation, true));
                }
            }

            function getYourPlayerIndex() {
                return playMode === "playWhite" ? 0 :
                        playMode === "playBlack" ? 1 :
                        playMode === "playViewer" ? -2 : // viewer is -2 (because -1 for turnIndexAfterMove means the game ended)
                        playMode === "playAgainstTheComputer" || playMode === "onlyAIs" ? turnIndex :
                        playMode === "passAndPlay" ? turnIndex :
                    playMode;
            }

            function getMatchState() {
                return {
                    turnIndexBeforeMove: turnIndexBeforeMove,
                    turnIndex: turnIndex,
                    endMatchScores: endMatchScores,
                    moveNumber: moveNumber,
                    randomSeed: randomSeed,
                    lastMove: lastMove,
                    lastState: lastState,
                    currentState: currentState,
                    lastVisibleTo: lastVisibleTo,
                    currentVisibleTo: currentVisibleTo
                };
            }

            function setMatchState(data) {
                if (data.turnIndexBeforeMove === undefined ||
                    data.turnIndex === undefined ||
                    data.endMatchScores === undefined) {
                    return;
                }
                turnIndexBeforeMove = data.turnIndexBeforeMove;
                turnIndex = data.turnIndex;
                endMatchScores = data.endMatchScores;
                moveNumber = data.moveNumber ? data.moveNumber : 0;
                randomSeed = data.randomSeed;
                lastMove = data.lastMove;
                lastState = data.lastState;
                currentState = data.currentState;
                lastVisibleTo = data.lastVisibleTo;
                currentVisibleTo = data.currentVisibleTo;
            }

            function getIntercom() {
                if ($window.Intercom !== undefined) {
                    return $window.Intercom.getInstance();
                }
                return null;
            }

            function broadcastUpdateUi() {
                var matchState = getMatchState();
                var intercom = getIntercom();
                if (intercom != null) {
                    $window.localStorage.setItem($window.location.toString(), angular.toJson(matchState));
                    intercom.emit('broadcastUpdateUi', matchState);
                } else {
                    sendUpdateUi();
                }
            }

            function gotBroadcastUpdateUi(data) {
                $log.info("gotBroadcastUpdateUi:", data);
                setMatchState(data);
                sendUpdateUi();
            }

            function delayedSendUpdateUi() {
                var moveForIndex = getMoveForPlayerIndex(turnIndex, lastMove);
                var stateBeforeMove = getStateForPlayerIndex(turnIndex, lastState, lastVisibleTo);
                var stateAfterMove = getStateForPlayerIndex(turnIndex, currentState, currentVisibleTo);
                if (lastMove.length > 0 && game.isMoveOk(
                    {
                        move : moveForIndex,
                        turnIndexBeforeMove : turnIndexBeforeMove,
                        turnIndexAfterMove : turnIndex,
                        stateBeforeMove : stateBeforeMove,
                        stateAfterMove : stateAfterMove,
                        numberOfPlayers: playersInfo.length
                    }) !== true) {
                    throwError("You declared a hacker for a legal move! move=" + moveForIndex);
                }

                game.updateUI(
                    {
                        move : moveForIndex,
                        turnIndexBeforeMove : turnIndexBeforeMove,
                        turnIndexAfterMove : turnIndex,
                        stateBeforeMove : stateBeforeMove,
                        stateAfterMove : stateAfterMove,
                        yourPlayerIndex : getYourPlayerIndex(),
                        playersInfo : playersInfo,
                        playMode: playMode,
                        moveNumber: moveNumber,
                        randomSeed: randomSeed,
                        endMatchScores: endMatchScores
                    });
            }

            function sendUpdateUi() {
                if ($rootScope.settings.simulateServerDelayMilliseconds === 0) {
                    delayedSendUpdateUi();
                } else {
                    $timeout(delayedSendUpdateUi, $rootScope.settings.simulateServerDelayMilliseconds); // Delay to simulate server delay.
                }
            }

            function makeMove(operations) {
                if (!game) {
                    throwError("You must call setGame before any other method.");
                }
                // Making sure only turnIndex can make the move
                if (turnIndex === -1) {
                    throwError("You cannot send a move after the game ended!");
                }
                if (getYourPlayerIndex() !== turnIndex) {
                    throwError("Expected a move from turnIndex=" + turnIndex + " but got the move from index=" + getYourPlayerIndex());
                }

                lastState = clone(currentState);
                lastVisibleTo = clone(currentVisibleTo);
                turnIndexBeforeMove = turnIndex;
                turnIndex = -1;
                lastMove = operations;
                moveNumber++;
                if (randomSeed) {
                    Math.seedrandom(randomSeed + moveNumber); // Math.random is used only in processApiOperation
                }
                setTurnOrEndMatchCount = 0;
                for (var i = 0; i < lastMove.length; i++) {
                    processApiOperation(lastMove[i]);
                }
                // We must have either SetTurn or EndMatch
                if (setTurnOrEndMatchCount !== 1) {
                    throwError("We must have either SetTurn or EndMatch, but not both: setTurnOrEndMatchCount=" + setTurnOrEndMatchCount);
                }
                if (!(turnIndex >= -1 && turnIndex < playersInfo.length)) {
                    throwError("turnIndex must be between -1 and " + playersInfo.length + ", but it was " + turnIndex + ".");
                }
                broadcastUpdateUi();
            }

            function setGame(_game) {
                if (game !== undefined) {
                    throwError("You can call setGame only once");
                }
                game = _game;
                get(game, "minNumberOfPlayers");
                get(game, "maxNumberOfPlayers");
                get(game, "isMoveOk");
                get(game, "updateUI");

                init();
                var intercom = getIntercom();
                if (intercom != null) {
                    intercom.on('broadcastUpdateUi', gotBroadcastUpdateUi);
                    var matchState = $window.localStorage.getItem($window.location.toString());
                    if (!isNull(matchState)) {
                        setMatchState(angular.fromJson(matchState));
                    }
                }
                sendUpdateUi();
            }


            function isTie() {
                if (!endMatchScores) {
                    return false;
                }
                var score = endMatchScores[0];
                for (var i = 0; i < endMatchScores.length; i++) {
                    if (score !== endMatchScores[i]) {
                        return false;
                    }
                }
                return true;
            }
            function getWinnerIndex() {
                if (!endMatchScores || isTie()) {
                    return null;
                }
                var winnerIndex = 0;
                for (var i = 0; i < endMatchScores.length; i++) {
                    if (endMatchScores[winnerIndex] < endMatchScores[i]) {
                        winnerIndex = i;
                    }
                }
                return winnerIndex;
            }

            this.getTurnIndex = function () { return turnIndex; };
            this.getYourPlayerIndex = getYourPlayerIndex;
            this.isYourTurn = function () { return turnIndex !== -1 && turnIndex === getYourPlayerIndex(); };
            this.getEndMatchScores = function () { return endMatchScores; };
            this.isTie = isTie;
            this.getWinnerIndex = getWinnerIndex;
            this.isWinner = function () { return getWinnerIndex() === getYourPlayerIndex(); };

            this.setGame = setGame;
            this.makeMove = makeMove;
            this.startNewMatch = startNewMatch;
            this.init = init;
            this.setPlayMode = setPlayMode;
            this.setRandomSeed = setRandomSeed;
            this.getMatchState = getMatchState;
            this.setMatchState = setMatchState;
        }]);