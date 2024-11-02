namespace SFGame
{
  export enum TetriminoType
  {
    Undef,    Line,   Block,   RightSkew, 
    LeftSkew, Pointy, RightEl, LeftEl, 

    First=Line,
    Last=LeftEl
  }

  // export function getRandomTetrimino() : TetriminoType
  // {
  //   return Math.floor((1+TetriminoType.Last-TetriminoType.First)*Math.random()) + TetriminoType.First;
  // }

  /**This class represents the data for a single tetrimino.  It can represent any of the seven tetriminos. 
   * It is the source data for TetriminoInstance, which is the actual runtime object.  */
  export class TetriminoData
  {
    /**The unrotated tile vectors that make up the tetrimino. */
    private m_tiles : Array<SFTT.Vector2>;
    private m_type : TetriminoType
    private m_color : string;


    private static m_tetriminoOrder: Array<TetriminoType> = [];
    private static m_currentIndex: number = 0;
    private static m_currentIndexToDisplayNextPiece: number = 1;
    

    public get NumTiles() : number { return this.m_tiles.length; }

    public get Color() : string { return this.m_color; }

    private constructor()
    {
      this.m_tiles = [];
      this.m_type = TetriminoType.Undef;
      this.m_color = null;
    }

    public static initializeTetriminoOrder(): void {
      // Generate a new order of tetriminos only once at the start
      if (this.m_tetriminoOrder.length === 0) {
        this.m_tetriminoOrder = [
          TetriminoType.Line,
          TetriminoType.Block,
          TetriminoType.LeftSkew,
          TetriminoType.RightSkew,
          TetriminoType.Pointy,
          TetriminoType.LeftEl,
          TetriminoType.RightEl
        ];

      }

      this.m_tetriminoOrder.sort(() => Math.random() - 0.5);
    }

    public static getNextTetrimino(): TetriminoType {
      if (this.m_currentIndex >= this.m_tetriminoOrder.length) {
        // Reset the order and shuffle again when all tetriminos have been used
        this.m_currentIndex = 0;
        this.initializeTetriminoOrder(); // Reshuffle

       
      }
      return this.m_tetriminoOrder[this.m_currentIndex++];
    }

    public static showNextTetrimino(): TetriminoType {
      
      if (this.m_currentIndexToDisplayNextPiece >= this.m_tetriminoOrder.length) {
        // Reset the order and shuffle again when all tetriminos have been used
        this.m_currentIndexToDisplayNextPiece = 1;
        this.initializeTetriminoOrder(); //Reshuffle
      }
      return this.m_tetriminoOrder[this.m_currentIndexToDisplayNextPiece++];
    }

    public static create(i_type:TetriminoType) : TetriminoData
    {
      let tetrimino = new TetriminoData();
      tetrimino.m_type = i_type;
      let tiles : Array<number> = null;
      let ttype = TetriminoType;

      //this is where the actual tetrimino tile data is described. Yay! Important note: these are given in 
      //relative tile coordinates, so they implicitly define an origin. 
      switch(i_type)
      {
        case ttype.Block :   tiles=[0,0,  0,1,  1,0, 1,1] ; tetrimino.m_color='rgba(128,40,140,255)'; break;
        case ttype.Line  :   tiles=[0,-1, 0,0,  0,1, 0,2] ; tetrimino.m_color='rgba(40,190,250,255)'; break;
        case ttype.LeftEl:   tiles=[0,-1, 0,0,  0,1, 1,1] ; tetrimino.m_color='rgba(30,160,180,255)'; break;
        case ttype.RightEl:  tiles=[0,-1, 0,0,  0,1,-1,1] ; tetrimino.m_color='rgba(220,20,220,255)'; break;
        case ttype.LeftSkew: tiles=[-1,0, 0,0,  0,1, 1,1] ; tetrimino.m_color='rgba(140,169,178,255)'; break;
        case ttype.RightSkew:tiles=[1,0,  0,0,  0,1,-1,1] ; tetrimino.m_color='rgba(90,180,210,255)'; break;
        case ttype.Pointy :  tiles=[-1,0, 0,0,  1,0, 0,1] ; tetrimino.m_color='rgba(240,220,110,255)'; break;
        default : throw `Unknown tetrimino type ${i_type}`;
      }

      tetrimino.addTiles(tiles);

      return tetrimino;
    }

    private addTiles(i_xynums:Array<number>)
    {
      for( let i = 0 ; i < i_xynums.length ; i+=2 )
      {
        let new_vec = SFTT.Vector2.create(i_xynums[i], i_xynums[i+1] );
        this.m_tiles.push(new_vec);
      }
    }

    /**Returns a rotation of this tetrimino, as a set of tile vectors. */
    public rotate(i_rotation:number, o_output:Array<SFTT.Vector2> ) : Array<SFTT.Vector2>
    {
      if( o_output.length !== this.m_tiles.length ) { throw "You must pass in a properly sized o_output array, pre-populated with vectors"; }

      for( let i = 0 ; i < this.m_tiles.length ; i++ )
      {
        o_output[i].copyInto(this.m_tiles[i]);
        if(this.m_type!==TetriminoType.Block) { this.rotateVec(o_output[i], i_rotation ); }
      }

      return o_output;
    }


    /**Rotates the vector in place.
     * @param io_vec the vector to rotate.
     * @param i_amount 0=0 degrees, 1=90 degrees, 2=180 degrees, 3=270 degrees. */
    private rotateVec( io_vec:SFTT.Vector2, i_amount:number )
    {
      //this method is a simplification of the universal formula:
      // x2 = x1*cos(t) - y1*sin(t)
      // y2 = x1*sin(t) + y1*cos(t)

      //rotate by 90 degrees
      if( i_amount===1 )
      {
        let x1 = io_vec.x;
        io_vec.x = -io_vec.y;
        io_vec.y = x1;
      }
      //rotate by 180 degrees
      else if( i_amount === 2 )
      {
        io_vec.mulIP(-1);
      }
      else if( i_amount === 3 )
      {
        let x1 = io_vec.x;
        io_vec.x = io_vec.y;
        io_vec.y = -x1;
      }
    }
  }
}