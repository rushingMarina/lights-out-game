import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/*    For the board:
*       .  .  .
*       O  O  .     (where . is off, and O is on)
*       .  .  .
*
*    This would be: [[f, f, f], [t, t, f], [f, f, f]] */

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard(),
      gaveUp: false,
      rulesOn: false,
      isLoading: true
    }
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.handleRandomMoves = this.handleRandomMoves.bind(this);
    this.randomMove = this.randomMove.bind(this);
    this.showRules = this.showRules.bind(this);
    this.showSoltn = this.showSoltn.bind(this);

  }

  /** creating a board nrows high/ncols wide */
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

  //when we radnomly doing a move we will flip cells aroung it, this way the board will stay solvable
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
    let hasWon = board.every(row => row.every(cell => !cell));
    this.setState({board, hasWon: hasWon});
  }

  playAgain() {
    this.handleRandomMoves();
    this.setState({ hasWon: false });
  }

  giveUp() {
    this.setState({ gaveUp: true });
  }

  showRules() {
    this.state.rulesOn ? this.setState({ rulesOn: 0 }) : this.setState({ rulesOn: 1 })
  }

  showSoltn() {
    this.state.gaveUp ? this.setState({ gaveUp: false }) : this.setState({ gaveUp: true })
  }

  componentDidMount() {
    this.handleRandomMoves();
    //this.setState({hasWon: true}); 
    this.setState({isLoading:false})
  }

  render() {

    if (this.state.isLoading) {
      return (
          <div>
            <h1>Loading...</h1>
          </div>
        );      

    }


    if (this.state.hasWon){
      return (
        <div>
          <h1 className="neon-blue win">You <span className="neon-pink win">win!</span></h1>
          <button className="Board-btn xenon" onClick={this.playAgain}>
            PLAY AGAIN 
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
    
    let giveUpBtn;
    let rulesBtn;
    this.state.rulesOn ? 
               rulesBtn = 
                 <div className='rulesBtn'>
                   <button onClick={this.showRules} className='giveUp Board-btn'>hide&nbsp;&nbsp;&nbsp; rules</button>
                   <p className='Board-rules'>LightsOut is a puzzle where you are given a grid of cells, or lights, with some dark and others light. You must turn them all off by clicking on the cells. Each click toggles that cell and each of its immediate neighbors.
                  </p>
                 </div> 
                : rulesBtn = <button onClick={this.showRules} className='giveUp Board-btn'>rules</button>
    if (!this.state.gaveUp) {
      giveUpBtn = <button onClick={this.showSoltn} className='giveUp Board-btn'>how &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp; win</button>
    } else {
      giveUpBtn = <div className='giveUpbtn'>
        <button onClick={this.showSoltn} className='giveUp Board-btn'>back &nbsp;&nbsp;to&nbsp;&nbsp; game</button> 
        <p className='Board-rules'>1) The easiest way to solve LightsOut puzzles is to use a method called 'Chase The Lights'. Starting with the second row, click on every cell that has a light on in the row above it. This will turn off all the lights in that row. Continue with each successive row until the only remaining lights are in the final row.<br/><br/>2) Now that you only have lights on in the final row, use the lookup table below and find the pattern of lights. This will tell you which lights to click in the top row. When you chase the lights this time, the bottom row will end up dark, just like the rest of the puzzle.
        </p>
        <table className="container Board-rules pattern">
          <tbody><tr><th>Bottom Row Lights</th><th>Top Row Clicks</th></tr>
            <tr><td>..***</td><td>...+.</td></tr>
            <tr><td>.*.*.</td><td>.+..+</td></tr>
            <tr><td>.**.*</td><td>+....</td></tr>
            <tr><td>*...*</td><td>...++</td></tr>
            <tr><td>*.**.</td><td>....+</td></tr>
            <tr><td>**.**</td><td>..+..</td></tr>
            <tr><td>***..</td><td>.+...</td></tr>
          </tbody></table>
      </div>
    }

     return (
        <div className='container'>
          <div className='content'>
            { !this.state.gaveUp ? (<div>
              <div className='Board-title'>
                <div className="neon-blue">Lights </div>
                <div className="neon-pink"> Out</div>
              </div>              
              <table className="Board"><tbody>{table}</tbody></table>
              <div className='container'>
                  {rulesBtn}
                  {giveUpBtn}
              </div>
              </div>): 
               <div className='contsiner'>
               <div className='Board-title'>
                 <div className="neon-blue">Lights </div>
                 <div className="neon-pink"> Out</div>
               </div>              
               <div className='container'>
                   {rulesBtn}
                   {giveUpBtn}
               </div>
               </div>}
              </div>
               <footer className='footer'>made by <a target='blank' href='http://rushingmarina.com/portfolio/' className='rushing'>RushingMarina</a> 💻</footer>
        </div>
            );
    
  }
  
}


export default Board;
