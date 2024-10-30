namespace SFGame
{
  export class GameBoard
  {
    private m_dims : SFTT.Vector2;
    private m_boardSizeCanvasPixels : SFTT.Vector2; //cached size of board in canvas pixels. 
    private m_boardColor:string = 'rgba(20,40,75,255)';

    /**Each entry is a tile. If null, the tile is occupied. If a string, it is the color of the tile
     * occupying that position. This is a 2d array with dimensions m_dimensions. */
    private m_data: Array<string>;

    /**Callback that is invoked when the death condition occurs. */
    private m_onDeath : ()=>void;

    public constructor(i_dims:SFTT.IReadOnlyVector2, i_onDeath:()=>void)
    {
      this.m_onDeath = i_onDeath;
      this.m_dims = i_dims.clone();
      this.m_boardSizeCanvasPixels = this.m_dims.clone();
      this.m_boardSizeCanvasPixels.mulcIP(Tetris.TILE_SIZE);
      this.m_data = new Array<string>(i_dims.x*i_dims.y);
      for( let i = 0 ; i < this.m_data.length ; i++ ) { this.m_data[i] = null; }
    }

    /**Returns null on no collision, or if collided, returns the new position that would "undo" the collision. 
     * The back correction vector is always "up" when colliding against tiles, but can be left or right against walls. 
     * @param i_pos The position of the tetrimino
     * @param i_tiles the tetrimino's tiles, in coordinates relative to its position. 
     * @returns the "resolved" position of the tetrimino, where it is no longer colliding but is about to, or null on no collision. */
    public checkCollision( i_tetrimino:TetriminoInstance ) : SFTT.Vector2
    {
      let working_vec = new SFTT.Vector2();

      let correction_x = 0;
      let correction_y = 0;

      const MAX_COUNT = i_tetrimino.Tiles.length*8;
      let cnt = 0;

      let new_pos = i_tetrimino.Position.clone();

      for( let i = 0 ; i < i_tetrimino.Tiles.length ; i++ )
      {
        if( ++cnt >= MAX_COUNT ) { return new_pos; } //failsafe mode. Don't run forever. Hopefully this never trips. 

        working_vec.copyInto(new_pos);
        working_vec.addIP(i_tetrimino.Tiles[i]);

        let block_here = this.getBlock(working_vec);
        if( working_vec.x < 0 || working_vec.x >= this.m_dims.x || working_vec.y >= this.m_dims.y || !!block_here )
        {
          //collision occurred. 
          if( working_vec.x < 0 ) { new_pos.x++; }
          if( working_vec.x >= this.m_dims.x ) { new_pos.x--; }
          if( working_vec.y >= this.m_dims.y ) { new_pos.y--; }
          if( !!block_here ) { new_pos.y--; }
          i = 0; //reset to the beginning. 

          console.log(`Collision occurred at tile: ${working_vec}, current new_pos=${new_pos}, original_pos=${i_tetrimino.Position}`)
        }
      }

      return new_pos.equals(i_tetrimino.Position) ? null : new_pos;
    }

    /**Adds a tetrimino to the board! This doesn't do any collision handling. Hopefully you already did that. */
    public addTetrimino( i_tetrimino:TetriminoInstance )
    {
      let working_vec = new SFTT.Vector2();
      for( let i = 0 ; i < i_tetrimino.Tiles.length ; i++ )
      {
        working_vec.copyInto(i_tetrimino.Position);
        working_vec.addIP(i_tetrimino.Tiles[i]);
        if( working_vec.y < 0 )
        {
          //board overflowed. You die!
          this.m_onDeath();
        }
        this.setBlock(working_vec, i_tetrimino.Source.Color );
      }

      this.destroyCompleteRows();
    }

    private destroyCompleteRows()
    {
      let cursor = new SFTT.Vector2();
      //walk from top to bottom of board, testing for any complete rows to destroy.
      for( cursor.y = 0 ; cursor.y < this.m_dims.y ; cursor.y++ )
      {
        let complete = true;
        for( cursor.x = 0 ; cursor.x < this.m_dims.x ; cursor.x++ )
        {
          if( !this.getBlock(cursor) ) { complete=false; break; } 
        }

        if( complete )
        {
          //delete this row. 
          this.m_data.splice( cursor.y*this.m_dims.x, this.m_dims.x );
          for( let i= 0 ; i < this.m_dims.x ; i++ ) { this.m_data.unshift(null); } //add an empty row at the top. 
        }
      }
    }

    public render()
    {
      Tetris.Instance.Render.drawRect(Tetris.BOARD_POS, this.m_boardSizeCanvasPixels, this.m_boardColor );

      //this is awful! Rendering the whole board each frame!
      let working_vec = new SFTT.Vector2();
      for( let i=0 ; i < this.m_data.length ; i++ )
      {
        if( this.m_data[i] )
        {
          working_vec.y = Math.floor( i / this.m_dims.x );
          working_vec.x = i - (working_vec.y*this.m_dims.x);
          Tetris.tile2canvas(working_vec);
          Tetris.Instance.Render.drawRect( working_vec, Tetris.TILE_SIZE, this.m_data[i] );
        }
      }
    }

    private getBlock(i_pos:SFTT.IReadOnlyVector2) : string
    {
      let idx = (i_pos.y*this.m_dims.x) + i_pos.x;
      return this.m_data[idx];
    }

    /**Sets a block. Can also be used to unset a block via passing null as color.  */
    private setBlock( i_pos:SFTT.IReadOnlyVector2, i_color:string )
    {
      let idx = (i_pos.y*this.m_dims.x) + i_pos.x;
      this.m_data[idx] = i_color;
    }
  }
}