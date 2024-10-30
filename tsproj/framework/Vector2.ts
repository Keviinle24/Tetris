namespace SFTT
{
  export interface IReadOnlyVector2
  {
    readonly x : number;
    readonly y : number;

    mag2() : number;
    magnitude() : number
    equals( i_rhs : IReadOnlyVector2 ) : boolean;
    inside( i_bounds : IReadOnlyVector2 ) : boolean;
    sign() : Vector2;
    clone() : Vector2;
  }

  export class Vector2 implements IReadOnlyVector2
  {
    public x: number;
    public y: number;

    public constructor() { this.x=0; this.y=0; }
    public static create(x:number,y:number) : Vector2
    {
      let vec = new Vector2();
      vec.x=x; vec.y=y;
      return vec;  
    }

    /**Create a vector from the 1st two elements of the submitted array. */
    public static createA( i_array:Array<number>) : Vector2
    {
      if( i_array.length < 2 ) { throw "Could not create vector from array with len=" + i_array.length; }

      let vec = new Vector2();
      vec.x = i_array[0];
      vec.y = i_array[1];
      return vec;
    }

    public equals( i_rhs : IReadOnlyVector2 ) : boolean
    {
      return this.x === i_rhs.x && this.y === i_rhs.y;
    }

    public addIP( i_rhs : IReadOnlyVector2 )
    {
      this.x += i_rhs.x;
      this.y += i_rhs.y;
    }

    public subIP( i_rhs : IReadOnlyVector2 )
    {
      this.x -= i_rhs.x;
      this.y -= i_rhs.y;
    }

    public mulcIP( i_rhs : IReadOnlyVector2 )
    {
      this.x *= i_rhs.x;
      this.y *= i_rhs.y;
    }

    public mulIP( i_rhs : number )
    {
      this.x *= i_rhs;
      this.y *= i_rhs;
    }

    public divcIP( i_rhs : IReadOnlyVector2 )
    {
      this.x /= i_rhs.x;
      this.y /= i_rhs.y;
    }

    /**Takes the absolute value of the individual fields of the vector and sets them in place. */
    public absIP()
    {
      this.x = Math.abs(this.x);
      this.y = Math.abs(this.y);
    }

    /**Returns a vector containing only the signs of each field. If a field is zero, the sign will also be zero.*/
    public sign() : Vector2
    {
      return Vector2.create( 
        (this.x > 0 ? 1 : this.x < 0 ? -1 : 0),
        (this.y > 0 ? 1 : this.y < 0 ? -1 : 0));
    }

    public copyInto( i_rhs : IReadOnlyVector2 )
    {
      this.x = i_rhs.x;
      this.y = i_rhs.y;
    }

    public set(i_x : number, i_y : number )
    {
      this.x = i_x;
      this.y = i_y;
    }

    public isNaN() : boolean
    {
      return isNaN(this.x) || isNaN(this.y);
    }


    /**Returns true if this vector is >= [0,0] and < [bounds.x,bounds.y]*/
    public inside( i_bounds : IReadOnlyVector2 ) : boolean
    {
      return this.x >= 0 && this.y >= 0 && this.x < i_bounds.x && this.y < i_bounds.y;
    }

    public static add( i_lhs : IReadOnlyVector2, i_rhs : IReadOnlyVector2 ) : Vector2
    {
      return Vector2.create( i_lhs.x+i_rhs.x, i_lhs.y+i_rhs.y);
    }

    /**LHS-RHS */
    public static sub( i_lhs : IReadOnlyVector2, i_rhs : IReadOnlyVector2 ) : Vector2
    {
      return Vector2.create( i_lhs.x-i_rhs.x, i_lhs.y-i_rhs.y );
    }

    public static mul( i_lhs : IReadOnlyVector2, i_rhs : number ) : Vector2
    {
      return Vector2.create( i_lhs.x*i_rhs, i_lhs.y*i_rhs );
    }

    /**Component-based multiply of two vectors. */
    public static mulc( i_lhs : IReadOnlyVector2, i_rhs : IReadOnlyVector2 ) : Vector2
    {
      return Vector2.create( i_lhs.x*i_rhs.x, i_lhs.y*i_rhs.y );
    }

    public static divc( i_lhs : IReadOnlyVector2, i_rhs : IReadOnlyVector2 ) : Vector2
    {
      return Vector2.create( i_lhs.x/i_rhs.x, i_lhs.y/i_rhs.y);
    }

    public static dot( i_lhs : IReadOnlyVector2, i_rhs : IReadOnlyVector2 )
    {
      return (i_lhs.x*i_rhs.x)+(i_lhs.y*i_rhs.y);
    }

    public mag2() : number
    {
      return (this.x*this.x)+(this.y*this.y);
    }

    public magnitude() : number
    {
      return Math.sqrt(this.mag2());
    }

    /**@return The square of the distance between this vector and i_other. */
    public dist2(i_other : IReadOnlyVector2) : number
    {
      return Math.pow(i_other.x - this.x, 2) + Math.pow(i_other.y - this.y, 2);
    }

    /**Normalizes the vector in place. If this is the 0-vector, this is treated as a no-op.*/
    public normalize()
    {
      let m = this.magnitude();
      if( m <= 10*Number.MIN_VALUE ) { return; }

      this.x /= m;
      this.y /= m;
    }

    /**A helper method that converts from a linear array index into a vector. The vector is
     * given in "tile coordinates" (where 0,0 is the upper-left / first entry in array).
     * @param i_index the index number to convert.
     * @param i_xrun the x dimension of the 2D grid. 
     */
    public static fromTileIndex( i_index:number, i_xrun:number ) : Vector2
    {
      let y = Math.floor(i_index/i_xrun);
      let x = i_index - (y*i_xrun);

      return Vector2.create(x,y);
    }

    /**Copies this vector and returns the copy*/
    public static copy( i_vec : IReadOnlyVector2 ) : Vector2
    {
      if( i_vec === null ) { return null; }
      return Vector2.create(i_vec.x, i_vec.y); 
    }

    /**Returns a value between (-pi,pi), where 0 is the positive x axis.*/
    public static angle(i_vec : IReadOnlyVector2) : number
    {
      return Math.atan2( i_vec.y, i_vec.x );
    }

    public toString()
    {
      return "<" + this.x + "," + this.y + ">";
    }
    public toRoundedKey()
    {
      return "" + Math.round(this.x) + '_' + Math.round(this.y)
    }

    public clone() : Vector2
    {
      return Vector2.create(this.x, this.y);
    }
  }

}