namespace SFTT
{
  /**The interface between typescript code and drawing things onto the canvas. */
  export class RenderManager
  {
    private m_canvas : HTMLCanvasElement;
    private m_context : CanvasRenderingContext2D;

    public constructor()
    {
      this.m_canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
      if( !this.m_canvas ) { throw "index.html is missing the mainCanvas element!"; }

      this.m_context = this.m_canvas.getContext("2d");
    }

    public clearCanvas()
    {
      this.m_context.save();
      this.m_context.setTransform(1,0,0,1,0,0);
      this.m_context.clearRect(0,0, this.m_canvas.width, this.m_canvas.height );

      this.m_context.restore();
    }

    /**Draws a colored rect on the canvas
     * @param i_pos The position of the upper-left corner of the rect in canvas coordinates. 
     * @param i_size The size of the rect in pixels.
     * @param i_color The color of the rect, in a valid CSS format, e.g. 'rgba(1,1,1,1)' (for full white).  */
    public drawRect( i_pos : IReadOnlyVector2, i_size : IReadOnlyVector2, i_color : string )
    {
      this.m_context.fillStyle = i_color;
      this.m_context.fillRect( i_pos.x, i_pos.y, i_size.x, i_size.y );
    }

  }
}