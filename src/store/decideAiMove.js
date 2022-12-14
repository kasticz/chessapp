import { allPieces } from "../classes/AllPieces";

export function decideAiMove(gameState, board, setBoard, Board,moveToRemake) {
  if (moveToRemake || board?.lastMoveStart || board?.playerColor === "black") {
    const xCoords = "87654321";
    const yCoords = "abcdefgh";
    const lastMoveStart = board?.lastMoveStart
      ? `${yCoords[board.lastMoveStart.y]}${xCoords[board.lastMoveStart.x]}`
      : "";
    const lastMoveEnd = board?.lastMoveStart
      ? `${yCoords[board.lastMoveEnd.y]}${xCoords[board.lastMoveEnd.x]}`
      : "";

      const prFigure =  board.promotionFigure ? board.promotionFigure === 'knight' ? 'n' : board.promotionFigure[0] : ''
    const lastMove = `${lastMoveStart}${lastMoveEnd}${prFigure}`;

    const altMoves = gameState?.state?.moves.split(' ')
    

    const gameLastMove = moveToRemake ||  gameState?.lastMove ||( altMoves ? altMoves[altMoves.length - 1] : null) ;

  

    

    if ( moveToRemake || (gameLastMove && gameLastMove !== lastMove)) {
      const startingCell = gameLastMove.slice(0, 2);
      const endCell = gameLastMove.slice(2);

      const promotionCheck = gameLastMove[4] ? gameLastMove[4] : null;
      const promotionFigures = {
        q: "queen",
        r: "rook",
        n: "knight",
        b: "bishop",
      };
      const promotionFigure = promotionCheck
        ? promotionFigures[promotionCheck]
        : null;

      const startingCellInBoard =
        board.cells[Math.abs(+startingCell[1] - 8)][
          +yCoords.indexOf(startingCell[0])
        ];
      const endCellInBoard =
        board.cells[Math.abs(+endCell[1] - 8)][+yCoords.indexOf(endCell[0])];

      const figureRank = startingCellInBoard.figure.rank;
      const f = startingCellInBoard.figure

      let specialMoveCheck =
        figureRank === "king" || figureRank === 'pawn' 
          ? startingCellInBoard.figure.validateMove(endCellInBoard)
          : null;

      const promFigure =         promotionFigure && specialMoveCheck[2]
      ? new allPieces[promotionFigure](
          startingCellInBoard.figure.color,
          endCellInBoard,
          board.playerColor === startingCellInBoard.figure.color,
          true
        ) : null

      const specialMove = startingCellInBoard.figure.makeMove(
        endCellInBoard,
        startingCellInBoard,
        specialMoveCheck && specialMoveCheck[1]
          ? specialMoveCheck[1]
          : null,
          promFigure 
      );

      const whoToMove = board?.playerColor === 'black' ? 'black' : 'white'

      const newBoard = new Board(
        board.cells,
        startingCellInBoard,
        specialMove?.newToPlaceCell || endCellInBoard,
        figureRank,
        board.playerColor,
        whoToMove,
        promotionFigure || null,
        [
          ...board.historyMoves || [],
          {
            figure: {rank: f.rank, color: f.color},
            toPlaceCell: endCellInBoard ,
            startCell: startingCellInBoard,
            promotionFigure: promFigure
          },
        ],
        board
      );
      newBoard.reapplyBoard();
      newBoard.checkForChecks();

      if(moveToRemake){
        return newBoard
      }

      setBoard((prevState) => {
        return newBoard;
      });
    }
  }
}