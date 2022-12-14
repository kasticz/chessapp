import { Figure } from "./Figure";

export class Pawn extends Figure {
  constructor(color, cell, playerFigure,startingPosition) {
    super("pawn", color, cell, `${color}_pawn`);
    this.startingPosition = startingPosition;
    this.playerFigure = playerFigure;
  }

  validateMove(toPlacecell, isForHighlight, isForLegality) {
    const verticalDiff =
      this.color === "white"
        ? this.cell.x - toPlacecell.x
        : toPlacecell.x - this.cell.x;
    const horizontalDiff = Math.abs(this.cell.y - toPlacecell.y);

    const board = this.cell.board.cells;

    if (isForHighlight) {
      if (
        Math.abs(verticalDiff) > 2 ||
        (horizontalDiff > 0 && Math.abs(verticalDiff) > 1) ||
        horizontalDiff > 1 ||
        verticalDiff <= 0
      ) {
        return false;
      }
    }

    let enPassantXCoord = toPlacecell.x - (this.color === "white" ? -1 : 1);
    enPassantXCoord =
      enPassantXCoord >= 0 && enPassantXCoord < 8 ? enPassantXCoord : null;

    const standartMove =
      verticalDiff === 1 && horizontalDiff === 0 && !toPlacecell.figure;

    const takeMove =
      verticalDiff === 1 &&
      horizontalDiff === 1 &&
      toPlacecell.figure &&
      toPlacecell.figure.color !== this.color;

    const enPassantMove = enPassantXCoord
      ? toPlacecell.board.cells[enPassantXCoord][toPlacecell.y]?.figure
          ?.enPassant &&
        verticalDiff === 1 &&
        (toPlacecell.y - this.cell.y === 1 || this.cell.y - toPlacecell.y === 1)
      : false;

    let twoCellsMove =
      verticalDiff === 2 && horizontalDiff === 0 && this.startingPosition;
    if (twoCellsMove) {
      const xDiff = this.color === "white" ? 1 : -1;
      twoCellsMove =
        !board[this.cell.x - xDiff][this.cell.y].figure &&
        !board[this.cell.x - xDiff * 2][this.cell.y].figure;
    }


    if (isForLegality) {
      return standartMove || twoCellsMove || enPassantMove || takeMove
    }

    const illegalmove = this.cell.board.checkForIllegalMoves(toPlacecell,this) 

    if (isForHighlight) {
      return this.getHighlightVerdict(
        toPlacecell,
        standartMove || twoCellsMove || enPassantMove,
        takeMove,
        illegalmove
      );
    }



    if (twoCellsMove && !isForHighlight) this.enPassant = true;

    const promotion = this.color === 'white' && toPlacecell.x === 0  || this.color === 'black' && toPlacecell.x === 7


    return [
      (standartMove || twoCellsMove || enPassantMove || takeMove) && !illegalmove,
      enPassantMove,
      promotion
    ];
  }





  makeMove(toPlaceCell, startingCell, enPassant,promotionFigure) {
    if(toPlaceCell.figure || enPassant || promotionFigure){
      this.cell.board.audio = 'take'
    }else{
      this.cell.board.audio = 'standard'
    }
    startingCell.placeFigure(null);
    enPassant &&
      this.cell.board.cells[toPlaceCell.x - (this.color === "white" ? -1 : 1)][
        toPlaceCell.y
      ].placeFigure(null);

    this.cell = toPlaceCell;
    this.cell.placeFigure(promotionFigure || this);

    if (this.startingPosition) this.startingPosition = false;
  }
}
