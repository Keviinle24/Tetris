namespace SFTT
{
  /**A class that manages the loading of assets for the game. 
   * Assets are loaded asynchronously, via the 'load' method. This method calls back 
   * with the success or failure of the operation. */
  export class AssetManager
  {
    /**The main texture sheet.  */
    public get MainSheet() : HTMLImageElement { return this.m_mainsheet; }
    private m_mainsheet : HTMLImageElement = null;

    /**loads all managed assets. 
     * @param i_callback will be invoked either when a failure occurs, or when all assets have loaded.*/
    public load( i_callback : (success:boolean)=>void)
    {
      //because we currently have one asset, this is a very simple method. 
      this.m_mainsheet = new Image();
      this.m_mainsheet.onload = ()=>
      {
        i_callback(true);
      };
      this.m_mainsheet.onerror = (err:ErrorEvent)=>
      {
        console.warn("Got loading failure: " + err.message );
        i_callback(false);
      };

      this.m_mainsheet.src = "tilesheet.png"; //kicks off load.
    }
  }
}