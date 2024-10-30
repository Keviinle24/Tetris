namespace SFTT
{
  /**The main abstraction for user input. Listens to window events and dispatches key events 
   * when appropriate keys are pressed. */

  export enum GameKeys
  {
    UP_ARROW,
    DOWN_ARROW,
    LEFT_ARROW,
    RIGHT_ARROW
  }

  export class InputManager
  {
    private m_application : Application;
    private m_keymap : {[index:number]:GameKeys};

    public constructor( i_app : Application )
    {
      this.m_application = i_app;
      this.m_keymap = {37:GameKeys.LEFT_ARROW, 38:GameKeys.UP_ARROW, 39:GameKeys.RIGHT_ARROW, 40:GameKeys.DOWN_ARROW};
      
      this.onkeyup  = this.onkeyup.bind(this);
      window.addEventListener( 'keyup', this.onkeyup  );
    }

    /**Relay the key press to game logic. */
    private onkeyup(i_event:KeyboardEvent)
    {
      if( i_event.keyCode in this.m_keymap )
      {
        this.m_application.onKeyPress( this.m_keymap[i_event.keyCode] );
      }
    }
  }
}