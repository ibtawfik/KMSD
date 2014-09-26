describe("In Kamisado ", function(){
  function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(kamisadoLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(true);
  }

  function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(kamisadoLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(false);
  }

  it("moves YELLOW piece of player0 from [7, 3] to [3, 3] from initial state is legal", function() {
  	expectMoveOk(0, {}, [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', 'T', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 3, col: 3}}}]);
  });

  it("moves ORANGE piece of player1 from [0, 0] to [2, 0] after the previous move is legal", function() {
  	expectMoveOk(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'YE', row: 3, col: 3}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [2, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', '', '', '', '', '', '', '' ],
            			  [ '', '', '', 'T', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'OR', row: 2, col: 0}}}]);
  });

  it("moves one of palyer0's piece to player1's side lead to player0's win is legal", function() {
    expectMoveOk(0, 
  		        {pieces: [{BR: [7, 0], GR: [5, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [2, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 6], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ '', 'T', 'T', 'T', '', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', '', '', '', '', 'T', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', '', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'YE', row: 2, col: 6}}, 
  		        [{endMatch: {endMatchScores: [1, 0]}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [5, 1], RE: [7, 2], YE: [0, 0], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [2, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 6], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', '', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', '', '', '', '', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 0, col: 0}}}]);
  });

  it("moves one of player1's piece to plyaer0's side lead to player1's win is legal", function() {
    expectMoveOk(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [4, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [3, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', '', 'T', 'T', 'T' ]],
                 delta: {color: 'PI', row: 4, col: 4}}, 
  		        [{endMatch: {endMatchScores: [0, 1]}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [4, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [7, 4], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'OR', row: 7, col: 4}}}]);
  });

  it("moves player0's piece backward is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [4, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [4, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ 'T', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', '', 'T', 'T', 'T' ]],
                 delta: {color: 'OR', row: 4, col: 0}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [4, 3], PI: [4, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [4, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', '', 'T', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', '', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 4, col: 3}}}]);
  });

  it("moves player0's piece not straight forward or diagonally forward is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [7, 0], GR: [3, 5], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [2, 4], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', '', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'GR', row: 2, col: 4}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [3, 5], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [5, 4], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [2, 4], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', '', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'PU', row: 5, col: 4}}}]);
  });

  it("moves player1's piece backward is illegal", function() {
    expectIllegalMove(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [6, 4], PU: [4, 2], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [5, 6], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', '', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', 'T', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', '', 'T', 'T' ]],
                 delta: {color: 'PI', row: 6, col: 4}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [6, 4], PU: [4, 2], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [4, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', '', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', '', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'GR', row: 4, col: 6}}}]);
  });

  it("moves player1's piece not straight forward or diagonally forward is illegal", function() {
    expectIllegalMove(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [5, 2], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', 'T', 'T' ]],
                 delta: {color: 'PI', row: 5, col: 2}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [5, 2], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [3, 6]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'BR', row: 3, col: 6}}}]);
  });

  it("moves a piece that is not matching the grid color is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [5, 2], PU: [7, 5], BL: [2, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 2], RE: [0, 5], GR: [0, 6], BR: [2, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', '', 'T', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', '', 'T' ]],
                 delta: {color: 'YE', row: 2, col: 2}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [1, 2], PU: [7, 5], BL: [2, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 2], RE: [0, 5], GR: [0, 6], BR: [2, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', '', 'T', 'T', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', '', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'PI', row: 1, col: 2}}}]);
  });

  it("moves player0's piece forward to jump over another piece is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [5, 2], PU: [7, 5], BL: [2, 6], OR: [6, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 2], RE: [6, 5], GR: [0, 6], BR: [2, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', 'T' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', '', '' ]],
                 delta: {color: 'RE', row: 6, col: 5}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [1, 2], PU: [7, 5], BL: [2, 6], OR: [6, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [2, 2], RE: [6, 5], GR: [0, 6], BR: [2, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', '', '', 'T', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', 'T' ],
                          [ 'T', 'T', 'T', 'T', '', 'T', '', '' ]]}},
               {set: {key: 'delta', value: {color: 'PI', row: 1, col: 2}}}]);
  });

  it("moves player1's piece forward to jump over another piece is illegal", function() {
    expectIllegalMove(1, 
  		        {pieces: [{BR: [7, 0], GR: [2, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [2, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', '', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'GR', row: 2, col: 1}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [2, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [2, 0], BL: [0, 1], PU: [0, 2], PI: [4, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ '', 'T', 'T', '', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'PI', row: 4, col: 3}}}]);
  });

  it("moves player0's piece diagonally forward to jump over another piece is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [4, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [5, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ 'T', '', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', 'T', 'T', '', 'T', 'T' ]],
                 delta: {color: 'BL', row: 5, col: 1}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [4, 0], PI: [7, 4], PU: [4, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [5, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', '', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', '', '', '', 'T', '', '' ],
                          [ '', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', 'T', '', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 4, col: 0}}}]);
  });

  it("moves player0's piece diagonally forward to jump over another piece is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [5, 0], GR: [7, 1], RE: [7, 2], YE: [4, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [5, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [2, 5]}],
   				 board:  [[ 'T', '', 'T', 'T', 'T', 'T', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ 'T', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', 'T', '', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'BL', row: 5, col: 1}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [5, 0], GR: [7, 1], RE: [7, 2], YE: [1, 6], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [5, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [2, 5]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', '', 'T', 'T', 'T', 'T', 'T', '' ],
                          [ '', '', '', '', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 1, col: 6}}}]);
  });

  it("moves player1's piece diagonally forward to jump over another piece is illegal", function() {
    expectIllegalMove(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [4, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'YE', row: 4, col: 3}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [4, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [5, 2]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'BR', row: 5, col: 2}}}]);
  });

  it("moves player1's piece diagonally forward to jump over another piece is illegal", function() {
    expectIllegalMove(1, 
  		        {pieces: [{BR: [7, 0], GR: [7, 1], RE: [2, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}],
   				 board:  [[ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', '', 'T', 'T', 'T', 'T', 'T' ]],
                 delta: {color: 'RE', row: 2, col: 2}}, 
  		        [{setTurn: {turnIndex: 0}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [2, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                          					 {OR: [4, 4], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ '', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', 'T', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', 'T', '', 'T', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'OR', row: 4, col: 4}}}]);
  });

  it("turn index not equal to 0 or 1 is illegal", function() {
  	expectIllegalMove(3, {}, [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', 'T', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 3, col: 3}}}]);
  });

  it("moves piece out of board is illegal", function() {
  	expectIllegalMove(0, {}, [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [7, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 8, col: 3}}}]);
  });

  it("mismatch between move and expected move is illegal", function() {
  	expectIllegalMove(0, {}, [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [7, 0], GR: [7, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [7, 7]},
                                             {OR: [0, 0], BL: [0, 1], PU: [0, 2], PI: [0, 3], YE: [0, 4], RE: [0, 5], GR: [0, 6], BR: [0, 7]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', 'T', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ '', '', '', '', '', '', '', '' ],
            			  [ 'T', 'T', 'T', '', 'T', 'T', 'T', 'T' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 3, col: 3}}}]);
  });

  it("stays at the same place when there is no legal move is legal", function() {
    expectMoveOk(0, 
  		        {pieces: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [5, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}],
   				 board:  [[ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]],
                 delta: {color: 'RE', row: 1, col: 5}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [5, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 5, col: 3}}}]);
  });

  it("stays at the same place when there is no legal move but changes state is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [5, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}],
   				 board:  [[ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]],
                 delta: {color: 'RE', row: 1, col: 5}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [5, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 5, col: 3}}}]);
  });

  it("moves when there is no legal move is illegal", function() {
    expectIllegalMove(0, 
  		        {pieces: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [5, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}],
   				 board:  [[ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]],
                 delta: {color: 'RE', row: 1, col: 5}}, 
  		        [{setTurn: {turnIndex: 1}},
               {set: {key: 'pieces', value: [{BR: [4, 0], GR: [6, 1], RE: [7, 2], YE: [3, 3], PI: [7, 4], PU: [7, 5], BL: [7, 6], OR: [6, 7]},
                          					 {OR: [0, 0], BL: [0, 1], PU: [4, 2], PI: [0, 3], YE: [4, 4], RE: [1, 5], GR: [0, 6], BR: [4, 3]}]}},
               {set: {key: 'board', value: [
            			  [ 'T', 'T', '', 'T', '', '', 'T', '' ],
                          [ '', '', '', '', '', 'T', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', '', '', 'T', '', '', '', '' ],
                          [ 'T', '', 'T', 'T', 'T', '', '', '' ],
                          [ '', '', '', '', '', '', '', '' ],
                          [ '', 'T', '', '', '', '', '', 'T' ],
                          [ '', '', 'T', '', 'T', 'T', 'T', '' ]]}},
               {set: {key: 'delta', value: {color: 'YE', row: 3, col: 3}}}]);
  });

  function expectLegalHistoryThatEndsTheGame(history) {
    for (var i = 0; i < history.length; i++) {
      expectMoveOk(history[i].turnIndexBeforeMove,
        history[i].stateBeforeMove,
        history[i].move);
    }
    expect(history[history.length - 1].move[0].endMatch).toBeDefined();
  }

  //only a legal history, the last move may not ends a game
  function expectLegalHistory(history) {
    for (var i = 0; i < history.length; i++) {
      expectMoveOk(history[i].turnIndexBeforeMove,
        history[i].stateBeforeMove,
        history[i].move);
    }
  }

  it("getRiddles returns legal histories where the last move ends the game", function() {
    var riddles = kamisadoLogic.getRiddles();
    expect(riddles.length).toBe(2);
    for (var i = 0; i < riddles.length; i++) {
      expectLegalHistoryThatEndsTheGame(riddles[i]);
    }
  });

  it("getExampleGame returns a legal history", function() {
    var exampleGame = kamisadoLogic.getExampleGame();
    expect(exampleGame.length).toBe(8);
    expectLegalHistory(exampleGame);
  });
});