namespace SFGame
{
  /**A runtime instantiation of a tetrimino. Tracks the position of the tetrimino and supports 
   * collisions with occupied tiles in the board. */
  export class TetriminoInstance
  {
    private m_source : TetriminoData;

    /**Our tiles in our current rotation, in tile coordinates relative to m_position. */
    private m_tiles : Array<SFTT.Vector2>;

    /**Position in tile coordinates. */
    private m_position : SFTT.Vector2;

    /**Our drop speed in tiles/second */
    private m_speed : number;

    /**The last time we moved.  */
    private m_lastMoved : number;

    /**Current rotation in 90 degree quadrants. 0=unrotated. */
    private m_currentRotation : number; 

    /**Get the tiles in their current rotation, relative to the position.*/
    public get Tiles() : Array<SFTT.Vector2> { return this.m_tiles; }

    /**Get the position of the tetrimino. */
    public get Position() : SFTT.Vector2 { return this.m_position; }

    public get Source() : TetriminoData { return this.m_source; }

    public static readonly DEFAULT_DROP_SPEED = 1;

    public constructor( i_type : TetriminoType )
    {
      this.m_source = TetriminoData.create(i_type);
      this.m_position = new SFTT.Vector2();
      this.m_position.x = 5;
      this.m_speed = TetriminoInstance.DEFAULT_DROP_SPEED;
      this.m_lastMoved = Date.now();
      this.m_currentRotation = 0;

      let num_tiles = this.m_source.NumTiles;
      this.m_tiles = [];
      for( let i = 0 ; i < num_tiles ; i++ ) { this.m_tiles.push( new SFTT.Vector2()); }

      this.m_source.rotate(0, this.m_tiles );
    }

    /**Sets the position of the block. Mainly intended for debugging. */
    public setPos(i_pos:SFTT.IReadOnlyVector2)
    {
      this.m_position.copyInto(i_pos);
    }

    public addPos(i_x:number, i_y:number )
    {
      this.m_position.x += i_x;
      this.m_position.y += i_y;
    }

    public render()
    {
      let working_vec = new SFTT.Vector2();
      for( let i = 0 ; i < this.m_tiles.length ; i++ )
      {
        working_vec.copyInto(this.m_position);
        working_vec.addIP(this.m_tiles[i]);
        Tetris.tile2canvas(working_vec);
        SFTT.Application.Instance.Render.drawRect( working_vec, Tetris.TILE_SIZE, this.m_source.Color );
      }
    }

    public update()
    {
      if( (Date.now() - this.m_lastMoved) > (1000/this.m_speed) )
      {
        //todo: check for collisions. 
        this.m_position.y++;
        this.m_lastMoved = Date.now();
        //console.log(`New block pos is: ${this.m_position}`);
      }
    }

    /**Rotate: if true, rotate right.  */
    public rotate(i_right:boolean)
    {
      //todo: check for collisions.
      let r = this.m_currentRotation;
      r += (i_right ? -1 : 1);
      if( r < 0 ) { r = 3; }
      r = r % 4; //should beb etween 0 and 3.
      
      this.m_source.rotate(r, this.m_tiles );
      this.m_currentRotation = r;
    }

  }
}