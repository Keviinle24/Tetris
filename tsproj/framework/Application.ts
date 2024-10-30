namespace SFTT
{
  /**The main application base class. The Tetris game class specializes off of this. */
  export abstract class Application
  {
    /**The main asset manager. */
    public get AssetManager() : AssetManager { return this.m_assets; }
    private m_assets : AssetManager;

    public get Render() : RenderManager { return this.m_render; }
    private m_render : RenderManager;

    private m_input : InputManager;

    /**The main application static. */
    public static get Instance() : Application { return Application.s_instance; }
    protected static s_instance : Application;

    protected constructor()
    {
      this.m_assets = new AssetManager();
      this.m_render = new RenderManager();
      this.m_input = new InputManager(this);
      
      if( Application.s_instance ) { throw "Double initialization of the game class." }
      Application.s_instance = this;
    }

    /**Call this to start the main program loop. */
    protected start()
    {
      this.m_assets.load( (i_success:boolean)=>
      {
        if(!i_success) { console.error("Failed to load assets, bailing..."); }
        else
        {
          this.run();
        }
      });
    }

    /**Gets called whenever a key is pressed (transitioning from down to up state).
     * @param i_key The key that was released.  */
    public abstract onKeyPress( i_key : GameKeys ) : void;

    /**override this and implement your game logic in it. This should include drawing all the elements
     * of the board every frame. */
    protected abstract  gameLogic() : void;
    
    /**Top-level main loop.  */
    private run()
    {
      this.m_render.clearCanvas();
      this.gameLogic();
      window.requestAnimationFrame( ()=>{this.run(); } );
    }

  }
}
