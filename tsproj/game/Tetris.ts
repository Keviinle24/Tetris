namespace SFGame
{
  /**The main game object. Implement tetris in here! */
  export class Tetris extends SFTT.Application
  {
    public static get Instance() : Tetris { return <Tetris>Tetris.s_instance; }

    //size of an individual tile in canvas pixels. 
    public static readonly TILE_SIZE : SFTT.IReadOnlyVector2 = SFTT.Vector2.create(32,32);

    //size of the board in tiles.
    public static readonly BOARD_DIMS : SFTT.IReadOnlyVector2 = SFTT.Vector2.create(10,20);

    //position of the board in canvas pixels, from the top left of the canvas.
    public static readonly BOARD_POS : SFTT.IReadOnlyVector2 = SFTT.Vector2.create(200,0);

    

    public get Board() : GameBoard { return this.m_gameBoard; }

    private m_activeBlock : TetriminoInstance;

    private m_gameBoard : GameBoard;

    private m_isDead : boolean;
    

    /**Converts a position in tile coordinates to one in canvas coordinates. conversion in place. */
    public static tile2canvas(io_pos:SFTT.Vector2 ) : SFTT.Vector2
    {
      io_pos.mulcIP(Tetris.TILE_SIZE);
      io_pos.addIP(this.BOARD_POS);

      return io_pos;
    }

    private constructor()
    {
      super();
      this.m_activeBlock = null;
      this.onDeath = this.onDeath.bind(this);
      this.m_isDead = false;
      this.m_gameBoard = new GameBoard(Tetris.BOARD_DIMS, this.onDeath );
    }

    private onDeath()
    {
      this.m_isDead = true;
      let banner = document.getElementById("GameOver");
      if( !banner ) { console.warn("gameover banner missing!"); }
      else
      {
        //turn on the banner.
        banner.hidden = false;
      }
    }

    public static main()
    {
      let game = new Tetris();
      game.start();
    }

    protected gameLogic()
    {
      this.m_gameBoard.render();
      if( !this.m_isDead ) { this.doActiveBlockUpdate(); }
    }

    private doActiveBlockUpdate() {
      if (this.m_activeBlock === null) {
          // Spawn a new one at the top
          const newTetrimino = new TetriminoInstance(TetriminoData.getNextTetrimino());
          const nextTetrimino = new TetriminoInstance(TetriminoData.showNextTetrimino());
          Tetris.renderNextPiece(nextTetrimino); // Render the next piece
          this.m_activeBlock = newTetrimino;
      }
  
      this.m_activeBlock.render();
      this.m_activeBlock.update();
      let new_pos = this.m_gameBoard.checkCollision(this.m_activeBlock);
      if (new_pos) {
          // Block was pushed around by a collision! Freeze it.
          this.m_activeBlock.setPos(new_pos);
          this.m_gameBoard.addTetrimino(this.m_activeBlock);
          this.m_activeBlock = null;
      }
  }
  

    private static renderNextPiece(tetrimino: TetriminoInstance) {
      const nextPieceCanvas = document.getElementById("next-piece") as HTMLCanvasElement;
      const context = nextPieceCanvas.getContext("2d");
      
      if (context) {
          context.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
          
          tetrimino.Tiles.forEach(tile => {
              const x = 35 + tile.x * 10; // Adjust as needed for sizing
              const y = 35 +  tile.y * 10; // Adjust as needed for sizing
              context.fillStyle = tetrimino.Source.Color;
              context.fillRect(x, y, 10, 10); // 10 is tile size for next piece preview
          });
      }
  }
  

    public onKeyPress(i_key:SFTT.GameKeys)
    {
      if( !this.m_activeBlock ) { return; } //nothing to do with no active block.

      if( i_key === SFTT.GameKeys.UP_ARROW )
      {
        this.m_activeBlock.rotate(false);

        //no chance of freezing here. We give you a grace of one tick even if you made contact with something.
        let new_pos = this.m_gameBoard.checkCollision(this.m_activeBlock);
        if( new_pos ) { this.m_activeBlock.setPos(new_pos); }
      }
      else if( i_key === SFTT.GameKeys.RIGHT_ARROW || i_key=== SFTT.GameKeys.LEFT_ARROW )
      {
        let change = (i_key===SFTT.GameKeys.RIGHT_ARROW ? 1 : -1);
        this.m_activeBlock.addPos( change, 0);
        let new_pos = this.m_gameBoard.checkCollision(this.m_activeBlock);
        if(new_pos) { this.m_activeBlock.addPos(-change,0); } //if you overstepped, fix your position.
      }
      else if( i_key === SFTT.GameKeys.DOWN_ARROW )
      {
        this.m_activeBlock.addPos(0,1);
        let new_pos = this.m_gameBoard.checkCollision(this.m_activeBlock);
        if( new_pos )
        {
          this.m_activeBlock.setPos(new_pos);
          this.m_gameBoard.addTetrimino(this.m_activeBlock);
          this.m_activeBlock=null;
        }
      }
    }
  }
}