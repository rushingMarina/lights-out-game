import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
  }

  constructor(props) {
    super(props);
    this.state = {
      isWon: 0,
      board: this.createBoard()
    }
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.handleRandomMoves = this.handleRandomMoves.bind(this);
    this.randomMove = this.randomMove.bind(this);

  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  createBoard() {
    //length of board is now nrows!
    let board = new Array(this.props.nrows);
    for (let i = 0 ;i<board.length;i++) {
      board[i] = new Array(this.props.ncols);
      for (let b = 0; b<this.props.ncols;b++) {
        board[i][b] = false;
      }
    }
    console.log(board);
    return board
  }

  randomMove() {
    let guess = Math.floor(Math.random() * this.props.nrows); // value from 0 to 4
    let guess_2 = Math.floor(Math.random() * this.props.ncols); // value from 0 to 4
    this.flipCellsAround(`${guess}-${guess_2}`);
  }

  //when we radnomly doing a move we weill flip cells aroung it, this way the board will stay solvable
  handleRandomMoves() {
    const numOfMoves = Math.floor(Math.random() * 5) + 3; // number of moves when game starts
    for (let i = 0; i < numOfMoves; i++) {
      this.randomMove();
    }
  }


  flipCellsAround(coord) {
    console.log("flipping", coord);
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    //turn of the cell itslef
    flipCell(y, x);
    flipCell(y-1,x); //top one
    flipCell(y+1,x);   //bottom one
    flipCell(y,x+1);   //right one
    flipCell(y, x-1);    //left one

    // win when every cell is turned off
    // TODO: determine is the game has been won
    
    let hasWon = board.every(row => row.every(cell => !cell));
    this.setState({board, hasWon: hasWon});
  }

  playAgain() {
    this.handleRandomMoves();
    this.setState({ hasWon: false });
  }

  componentDidMount() {
    this.handleRandomMoves();
  }

  render() {
    if (this.state.hasWon){
      return (
        <div>
          <h1>You win!</h1>
          <button className="Board-btn" onClick={this.playAgain}>
            PLAY AGAIN ?
          </button>
        </div>
      );

    }
    let table = [];
    for (let y=0; y< this.props.nrows; y++) {
      let row = [];
      for (let x =0; x< this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(<Cell 
                key={coord} 
                coord={coord}
                isLit={this.state.board[y][x]} 
                flipCellsAround = {() => this.flipCellsAround(coord) }
                />); 
      }
      table.push(<tr key={y}>{row}</tr>)
    }

      return (
        <table className="Board">
          <tbody>
            {table}
          </tbody>
        </table>
      );
    
    

    // TODO
    


    // make table board
  

    // TODO
  }
}


export default Board;
