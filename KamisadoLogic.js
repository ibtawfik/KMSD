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

  return {isMoveOk: isMoveOk};
}());