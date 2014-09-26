/*jslint devel: true, indent: 2 */
/*global console */
var kamisadoLogic = (function () {
  'use strict';

  //game board with the colors of each grid
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
      if (object1 === object2) {
        return true;
      }
      if (typeof object1 != 'object' && typeof object2 != 'object') {
        return object1 == object2;
      }
      try {
        var keys1 = Object.keys(object1);
        var keys2 = Object.keys(object2);
        var i, key;

        if (keys1.length != keys2.length) {
          return false;
        }
        //the same set of keys (although not necessarily the same order),
        keys1.sort();
        keys2.sort();
        // key test
        for (i = keys1.length - 1; i >= 0; i--) {
          if (keys1[i] != keys2[i])
            return false;
        }
        // equivalent values for every corresponding key
        for (i = keys1.length - 1; i >= 0; i--) {
          key = keys1[i];
          if (!isEqual(object1[key], object2[key])) {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    }

  function copyObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  //player win by getting one of their pieces to the other end of the board
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

  //create move base on the information submitted by player
  function createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndexBeforeMove) {
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

  //check if a piece moves forward or diagonally forward
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

  //check if there is any other existing piece on the path that a player tend to move
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

  //return true if there is no move for a player
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
        col = deltaValue.col,
        pieces = stateBeforeMove.pieces;
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
        //get the coordinate before moving
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
          var noMove = createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndexBeforeMove);
          if (!isEqual(noMove, move)) {
            return false;
          }
          return true;
        }
        return false;
      }

      //check if a piece moves out of board
      if (row > 7 || row < 0 || col > 7 || col < 0) {
        return false;
      }

      //the color of the moving piece must be the same as
      //the color of the grid on which the opponent's piece
      //stopped last round
      if (pieceColor !== gridColor) {
        return false;
      }

      //can only move straight forward or diagonally forward
      var rowDiff = row - rowPrev,
        colDiff = col - colPrev;
      if (!checkDirection(turnIndexBeforeMove, rowDiff, colDiff)) {
        return false;
      }

      //it is not allowed to jump over other pieces
      if (pieceOnPath(board, row, col, rowPrev, colPrev)) {
        return false;
      }

      //create the expected move and check with the input
      var expectedMove = createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndexBeforeMove);
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
        pieceColor = deltaAndComment.color,
        pieces = state.pieces,
        board = state.board;

        if (pieces === undefined) {
        pieces = [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                  {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}
                  ];
        }

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

      var coordinate = pieces[turnIndex][pieceColor],
        rowPrev = coordinate[0],
        colPrev = coordinate[1],
        move = createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndex);

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

  return {isMoveOk: isMoveOk, getExampleGame: getExampleGame, getRiddles: getRiddles};
}());