/*jslint devel: true, indent: 2 */
/*global console */
var isMoveOk = (function () {
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
    return JSON.stringify(object1) === JSON.stringify(object2);
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

  function createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndexBeforeMove) {
    var boardAfterMove = copyObject(board),
      piecesAfterMove = copyObject(pieces),
      winner = getWinner(piecesAfterMove),
      firstOperation;
    boardAfterMove[rowPrev][colPrev] = '';
    boardAfterMove[row][col] = 'T';
    piecesAfterMove[turnIndexBeforeMove][pieceColor] = [row, col];
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
    return false;
  }

  //check if there is any other existing piece on the path
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
  }

  //check if there is any legal move
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
            //console.log("state changed when there is no leagl move");
            return false;
          }
          return true;
        }
        return false;
      }

      //check if a piece moves out of board
      if (row > 7 || row < 0 || col > 7 || col < 0) {
        //console.log("out of board");
        return false;
      }

      //the color of the moving piece must be the same as
      //the color of the grid on which the opponent's piece
      //stopped
      if (pieceColor !== gridColor) {
        //console.log("color mismatch");
        return false;
      }

      //can only move straight forward or diagonally forward
      var rowDiff = row - rowPrev,
        colDiff = col - colPrev;
      if (!checkDirection(turnIndexBeforeMove, rowDiff, colDiff)) {
        //console.log("illegal move");
        return false;
      }

      //it is not allowed to jump over another pieces
      if (pieceOnPath(board, row, col, rowPrev, colPrev)) {
        //console.log("jump over other piece");
        return false;
      }

      //create the expected move and check with the input
      var expectedMove = createMove(pieces, board, row, col, rowPrev, colPrev, pieceColor, turnIndexBeforeMove);
      if (!isEqual(move, expectedMove)) {
        //console.log("mismatch with expected move");
        return false;
      }
    } catch (e) {
      //automatically return false if any exception detected
      return false;
    }
    //passed the tests for all the rules
    return true;
  }

  //manual test cases
  console.log(
    [
      //player 0 moves Brown tower from [7, 0] to [4, 0]
      //expect to return true
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {},
               move: [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ 'T', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'BR', row: 4, col: 0}}}]}),

      //based on last turn, player 1 moves Yellow from [0, 4] to [2, 2]
      //expect to return true
      isMoveOk({turnIndexBeforeMove: 1,
               stateBeforeMove: {pieces: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
                                 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ 'T', '', '', '', '', '', '', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ]],
                                 delta: {color: 'BR', row: 4, col: 0}
                                },
               move: [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 2], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            [ 'T', 'T', 'T', 'T', '', 'T', 'T', 'T' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', 'T', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ 'T', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 2, col: 2}}}]}),

      //player 0 should move BR but no legal move, so he put BR at the same place which means he passes
      //expect to return true
      isMoveOk({turnIndexBeforeMove: 0,
               stateBeforeMove: {pieces: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [3, 4], PU: [5, 5], BL: [7, 6], OR: [7, 7]},
                                          {OR: [3, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [3, 1], RE: [0, 5], GR: [0, 6], BR: [1, 6]}],
                                 board:  [[ '', 'T', 'T', 'T', '', 'T', 'T', '' ],
                                          [ '', '', '', '', '', '', 'T', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ 'T', 'T', '', '', 'T', '', '', '' ],
                                          [ 'T', '', '', '', '', '', '', '' ],
                                          [ '', '', '', '', '', 'T', '', '' ],
                                          [ '', '', '', '', '', '', '', '' ],
                                          [ '', 'T', 'T', 'T', '', '', 'T', 'T' ]],
                                 delta: {color: 'BR', row: 1, col: 6}
                                },
               move: [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [3, 4], PU: [5, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [3, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [3, 1], RE: [0, 5], GR: [0, 6], BR: [1, 6]}]}},
               {set: {key: 'board', value: [
            [ '', 'T', 'T', 'T', '', 'T', 'T', '' ],
            [ '', '', '', '', '', '', 'T', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ 'T', 'T', '', '', 'T', '', '', '' ],
            [ 'T', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', 'T', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', 'T', 'T', 'T', '', '', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'BR', row: 4, col: 0}}}]}),

      //the state is the same with case3 but this time player0 moves BR to [2, 0]
      //expect to return false
      isMoveOk({turnIndexBeforeMove: 0,
                   stateBeforeMove: {pieces: [{BR: [4, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [3, 4], PU: [5, 5], BL: [7, 6], OR: [7, 7]},
                                              {OR: [3, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [3, 1], RE: [0, 5], GR: [0, 6], BR: [1, 6]}],
                                     board:  [[ '', 'T', 'T', 'T', '', 'T', 'T', '' ],
                                              [ '', '', '', '', '', '', 'T', '' ],
                                              [ '', '', '', '', '', '', '', '' ],
                                              [ 'T', 'T', '', '', 'T', '', '', '' ],
                                              [ 'T', '', '', '', '', '', '', '' ],
                                              [ '', '', '', '', '', 'T', '', '' ],
                                              [ '', '', '', '', '', '', '', '' ],
                                              [ '', 'T', 'T', 'T', '', '', 'T', 'T' ]],
                                     delta: {color: 'BR', row: 1, col: 6}
                                    },
                   move: [{setTurn: {turnIndex: 1}},
                   {set: {key: 'pieces', value: [{BR: [2, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [3, 4], PU: [5, 5], BL: [7, 6], OR: [7, 7]},
                                                 {OR: [3, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [3, 1], RE: [0, 5], GR: [0, 6], BR: [1, 6]}]}},
                   {set: {key: 'board', value: [
            [ '', 'T', 'T', 'T', '', 'T', 'T', '' ],
            [ '', '', '', '', '', '', 'T', '' ],
            [ 'T', '', '', '', '', '', '', '' ],
            [ 'T', 'T', '', '', 'T', '', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', '', '', '', '', 'T', '', '' ],
            [ '', '', '', '', '', '', '', '' ],
            [ '', 'T', 'T', 'T', '', '', 'T', 'T' ]]}},
                   {set: {key: 'delta', value: {color: 'BR', row: 2, col: 0}}}]})
    ]
  );

  return isMoveOk;
}());