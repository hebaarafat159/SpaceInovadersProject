function init() {

    /*----- CONSTANTS -----*/
    // movements keys
    const MOVENETS_KEYS = {
        UP_KEY_CODE : 38,
        DOWN_KEY_CODE : 40,
        RIGHT_KEY_CODE : 39,
        LEFT_KEY_CODE : 37,
        SPACE_KEY_CODE : 32
    };

    const ELEMENTS_SRC_KEYS = {
        player: 'spaceship',
        bolt: 'bolt',
        alien: 'alien',
        bum: 'bum'
    }

    const DROP_DUM_TIME_INTERVAL = 2000;
    const DROP_MOVING_TIME_INTERVAL = 50;
    const SHOOT_BOLT_TIME_INTERVAL = 50;
    const MOVING_ALIEN_DOWN_TIME_INTERVAL = 1000;

    const SCORE_ALIENT_RANGE = 100;
    const SCORE_BUM_RANGE = 1000;

    const LIVES_MAX_NUMBERS = 3;

    // init timmers
    let aliensTimmer = null;
    let dropBumTimmer = null;
    let shootBoltTimmer = null;
    let bumMovingTimmer = null;


    let aliens = [];
    let player = null;
    let start = false;

    // gird Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;

    // create grid
    let gridView = document.querySelector('.grid');
    const scoreView = document.getElementById('score');
    const livesView = document.getElementById('lives');
    const modelView = document.getElementById('messageModelId');
    const loseAudio = new Audio("./audio/gameover.wav");
    const winAudio = new Audio("./audio/win.mp3");


    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);
    
    class Element {
        constructor(src, startingPosition){
            this.src = src;
            this.startingPosition = startingPosition;
            this.currentPosition = this.startingPosition;
        }

        /**
         * 
         * this function used to move elements by hidding its image from the current position, 
         * increase or decrease the current position and finaly show the element on it's new 
         * position on the grid. 
         * 
         * @param {*} movingDirection // which direction should the element move to (Left | Right | Up | Down). \
         * it should be one of 'MOVENETS_KEYS' constant values.
         */
        moveElement(movingDirection){
            let hasNext = true;
            this.hideFromGrid(this.currentPosition);
            switch(movingDirection){
                case MOVENETS_KEYS.UP_KEY_CODE:
                    if(this.currentPosition > width)
                    {
                        this.currentPosition -= width;
                    }
                    else{
                        hasNext = false;
                    } 
                    break;
                case MOVENETS_KEYS.DOWN_KEY_CODE:
                    if(this.currentPosition < cellCount-width)
                    {
                        this.currentPosition += width;
                    } else{
                        hasNext = false;
                    }   
                    break;
                case MOVENETS_KEYS.RIGHT_KEY_CODE:
                    if(this.currentPosition % width < (width-1))
                    {
                        this.currentPosition++;
                    }
                    break;
                case MOVENETS_KEYS.LEFT_KEY_CODE:
                    if(this.currentPosition % width > 0)
                    { 
                        this.currentPosition--;
                    }
                    break;
                default:
                    hideFromGrid(this.currentPosition);
                    break;
            }
           
            this.showInGrid(this.currentPosition);
            return hasNext;
        }

        showInGrid()
        {
            const cellView = document.querySelector(`.grid > div:nth-child(${this.currentPosition+1})`);
            cellView.classList.add(this.src);
        }
    
        hideFromGrid(position, element)
        {
            const cellView = document.querySelector(`.grid > div:nth-child(${this.currentPosition+1})`);
            cellView.classList.remove(this.src);
        }
    }

    class Player extends Element{
        constructor(startingPosition){
            super(ELEMENTS_SRC_KEYS.player, startingPosition);
            this.bolt = null;
        }

        hasBolt(){
            return (this.bolt !== null && this.bolt !== undefined);
        }

        deleteBolt(){
            if(this.hasBolt())
             {
                 this.bolt.hideFromGrid();
                 this.bolt = null;
             }
        }

        shoot(){
            if(this.bolt === null)
                this.bolt = new Bolt(this.currentPosition);
            return(this.bolt.moveElement(MOVENETS_KEYS.UP_KEY_CODE));
        }
    }

    class Bolt extends Element{
        constructor(startingPosition){
            super(ELEMENTS_SRC_KEYS.bolt, startingPosition);
        }
    }

    class Alien extends Element{
        constructor(startingPosition){
            super(ELEMENTS_SRC_KEYS.alien, startingPosition);
            this.bum = null;
        }

        /**
         * return true if the alien has a bum, else return false 
         * */  
        hasBum(){
            return (this.bum !== null && this.bum !== undefined);
        }

        deleteBum(){
             // delete bum if exists
             if(this.hasBum())
             {
                 this.bum.hideFromGrid();
                 this.bum = null;
             }
        }
        
        moveDown(){
            // move the bum first then the alien
            if(this.hasBum())
                this.bum.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);
            return this.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);
        }

    }

    class Bum extends Element{
        constructor(startingPosition){
            super(ELEMENTS_SRC_KEYS.bum, startingPosition);
        }
    }

    /*----- FUNCTIONS -----*/
  
    function startGame(){
        // restore values in case of play again
        if(!start){
            console.log('Plaaaaaaaay Agaaaaaaaaain');
            resetAllGridElement();
            // clear lives grid
            clearLives();
            // reset score
            updateScore(0,0);
        }
        
        play();
        
    }

    function loadGrid(){
        // stop timmers
        stopAllTimers();
            
        // reset all grid variables
        resetAllGridElement();
           
        // call play 
        renderGame();
    }

    /**
     * this function is called by start game button and
     * it generates new game grid and initialize and render all the grid components.
     */
   function play(){ 
        // render lives view
        renderLivesview();
        renderGame();
    }

    function renderGame()
    {
         // create new grid view
         renderGrid();

         // initialize player object and calculate it's first position.
         renderPlayer();
 
         // change this calculation
         let totalAlientNumber = (height/2);
         renderAliens(totalAlientNumber);
    }

    /**
     * this function calculate each cell width and height, create them 
     * and appends them to the game main grid.
     */
    function renderGrid()
    {
        // Use the cellCpint to create our grid cells
        for(let i = 0; i < cellCount; i++)
        {
            const cell = document.createElement('div');
            // Add index as attribute
            cell.dataset.index = i;
            // cell.setAttribute('data-index', i);
            cell.style.height = `${100/height}%`;
            cell.style.width = `${100/width}%`;

            // Add cell to grid
            gridView.appendChild(cell);
        }
    }

    function clearGrid(){ 
        gridView.innerHTML = "";
    }
   
    function clearLives(){ 
        livesView.innerHTML = "";
    }

    /**
     * this function calculates player starting posotion 
     * and creates player object with the initial values
     */
    function renderPlayer(){
         // calculate player starting position
         const playerStartPosition = (cellCount - (width*2)) + (height/2) ;
         player = new Player(playerStartPosition);
         player.showInGrid();
    }

    /**
     * this function create and display aliens list in the row, 
     * after it calculate it's starting position. 
     * @param {*} totalAlientNumber // number of aliens shoould be displayed in the window.
     */
    function renderAliens(totalAlientNumber){
        if(totalAlientNumber > 0)
        {
            // calculate number of aliens in each row.
            let position = 0;
            let randomPsotion = 0; 
            let indexes = [];
            // create aliens in randem positions and insert aliens to list
            for(let i=0; i < totalAlientNumber; i++)
            {
                randomPsotion = Math.floor(Math.random() * (width-1))
                if(indexes.indexOf(randomPsotion) === -1)
                {
                    indexes.push(randomPsotion);
                    position =  randomPsotion + (((height/2) -1 )* height);
                    aliens.push(new Alien(position));
                }
            }

            if( (aliens!==null) && (aliens !== undefined) && (aliens.length > 0))
            {
                aliens.forEach(alien => {alien.showInGrid();});
                startTimers();
           }
        }
    }

    function startTimers(){
        if( (aliens!==null) && (aliens !== undefined) && (aliens.length > 0))
        {
            //init timmers move aliens down
            aliensTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
            //set timmer to drop a bum.
            dropBumTimmer = setInterval(startDropBumTimmer,DROP_DUM_TIME_INTERVAL);
        }
    }

    // start timmers
    function startAliensTimmer() {

        if(aliens.length > 0)
        {
            let alienObject = null;
            for(let i=0; i<aliens.length ;i++)
            {
                alienObject = aliens[i];
                let hasNext = alienObject.moveDown();
                if(hasNext)
                {
                    if((alienObject.hasBum() && alienObject.bum.currentPosition === player.currentPosition) 
                    || alienObject.currentPosition === player.currentPosition){
                        // lose live
                        stopAllTimers();
                        loseLive();
                        break;
                    }
                }else{
                    // game over
                    alienObject.hideFromGrid();
                    // show game over message if an alien reaches the buttom borader.
                    stopAllTimers();
                    showMessage(-1);
                    break;
                }
            }
        }
    }

    function startDropBumTimmer() {
        let selectRandemAlienIndex = Math.floor(Math.random() * (aliens.length))
        let selectedAlien = aliens[selectRandemAlienIndex];
       
        bumMovingTimmer = setInterval(startMovingBum(selectedAlien),DROP_MOVING_TIME_INTERVAL);   
    }

    function startMovingBum(selectedAlien){
        if(selectedAlien != null )
        {
            if(selectedAlien.bum === null || selectedAlien.bum === undefined)
                selectedAlien.bum = new Bum(selectedAlien.currentPosition);
            // hide bum when it reaches the bottom eadge
            
            if(selectedAlien.hasBum() && selectedAlien.bum.currentPosition === player.currentPosition){
                // lose live
                stopAllTimers();
                loseLive();
            }

            if(!(selectedAlien.bum.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE)))
            { 
                stopMovingBumTimmer();
                selectedAlien.deleteBum();
            }
        } 
    }

    function startShootBoltTimmer() {
        let hasNext = player.shoot();
       
        // check winning
        checkWinning(hasNext);
    }

    function checkWinning(hasNext){
        // check if the bolt hit any of the alins
        if((aliens.length > 0) && (hasNext))
        {
            let alienObject = null;
            for(let i=0; i<aliens.length ;i++)
            {
                alienObject = aliens[i];
                console.log(`alien object ${alienObject.currentPosition}` );
                if((alienObject.hasBum() && alienObject.bum.currentPosition === player.bolt.currentPosition) 
                    || alienObject.currentPosition === player.bolt.currentPosition){
                
                    // stop shooting timer
                    stopShootBoltTimmer();
                    
                    // update score with bum score
                    if(alienObject.hasBum())
                         updateScore(1, SCORE_BUM_RANGE);

                    // update score with alien score
                    updateScore(1, SCORE_ALIENT_RANGE);

                    /* remove and hide alien and bum  */
                    
                    // delete and remove bum if exsits
                    alienObject.deleteBum();
                    // hide alien
                    alienObject.hideFromGrid();

                    // delete alin from alins list
                    aliens.splice(i,1);
                                  
                    // remove and hide bolt
                    player.deleteBolt();   
                        
                    break;
                }
            }

            isPlayerWin();
        }else{
            // stop shooting timer
            stopShootBoltTimmer();
            player.deleteBolt();
            isPlayerWin();
        }
    }
 
    function isPlayerWin(){
        if(aliens.length === 0)
            showMessage(1);
    }

    // stop timmers
    function stopAllTimers(){
        stopAliensTimmer();
        stopDropBumTimmer();
        stopShootBoltTimmer();
        stopMovingBumTimmer();
    }

    function stopAliensTimmer(){
        if(aliensTimmer!==null)
            clearInterval(aliensTimmer);
    }

    function stopDropBumTimmer(){
        if(dropBumTimmer!==null)
            clearInterval(dropBumTimmer);
    }

    function stopShootBoltTimmer(){
        if(shootBoltTimmer!==null)
            clearInterval(shootBoltTimmer);
    }

    function stopMovingBumTimmer(){
        if(bumMovingTimmer!==null)
            clearInterval(bumMovingTimmer);
    }

    function resetAllGridElement(){
         //empty aliens list
         aliens = [];
         // create new player
         player = null;
         // clear grid
         clearGrid();
    }

    /**
         * this function is for updating score view with the new value
         * @param {*} functioRequest // 1 -> increase score value, -1 dicrease score value, 0 restscore value to 0 
         * @param {*} value // the number that the score will be increase or dicrease by.
         */
    function updateScore(functioRequest, value){
        let scoreValue = getScoreValue();
        switch(functioRequest)
        {
            case 1:
                scoreValue += value;
                scoreView.style.color = 'green';
                break;
            case -1:
                scoreValue -= value;
                scoreView.style.color = 'red';
                break;
            default:
                scoreValue = 0;
                scoreView.style.color = 'gray';
                break;
        }
        scoreView.innerText = scoreValue;
        console.log(`new score is : ${scoreValue}`);
    }

    /**
     * retuen the score displayed value
     */
    function getScoreValue(){
        return parseInt(scoreView.innerText);
    }

    /**
    * this function is to render player number of hearts during the game and reset the view during the game 
    * @param {*} functioRequest // 1 -> increase score value, -1 dicrease score value, 0 restscore value to 0 
    */
    function loseLive(){
        loseAudio.play();
        if(livesView.hasChildNodes())
        { 
           livesView.removeChild(livesView.lastChild);
           // reload Grid
           loadGrid();
        }else
        {
            // show game over message
            showMessage(-1);
        }
    }

    function renderLivesview(){
        for(let i=0; i< LIVES_MAX_NUMBERS; i++)
        {
            let live = document.createElement('div');
            live.classList.add(ELEMENTS_SRC_KEYS.player);
            livesView.appendChild(live);
        }
    }
    function handleMovement(event){
       
        const pressedKey = event.keyCode;
        
        switch(pressedKey){
            
            case MOVENETS_KEYS.UP_KEY_CODE:
                console.log("UP");  
                // player.bolt.moveElement(MOVENETS_KEYS.UP_KEY_CODE);
                break;
            case MOVENETS_KEYS.DOWN_KEY_CODE:
                console.log("DOWN");
                // stopAllTimers();
                break;
            case MOVENETS_KEYS.RIGHT_KEY_CODE:
            case MOVENETS_KEYS.LEFT_KEY_CODE:
                player.moveElement(pressedKey);
                if(player.bolt !== null && player.bolt !== undefined)
                    player.bolt.currentPosition = player.currentPosition;
                break;
            case MOVENETS_KEYS.SPACE_KEY_CODE:
                console.log('shooooooooooot');
                shootBoltTimmer = setInterval(startShootBoltTimmer, SHOOT_BOLT_TIME_INTERVAL);
                break;
        }
    }

    /**
     * this function display the a message to start or to replay the game.
     * @param {*} requtedAction // 1 -> player winnes, -1 player loses, 0 start the game 
     */
    function showMessage(requtedAction){
        let message = '';
        let buttonTitle = 'Start Game'
        switch(requtedAction)
        {
            case 1:
                winAudio.play();
                buttonTitle = 'Play Again';
                message = `Congratulation you win with score of ${getScoreValue()}`;
                break;
            case -1:
                loseAudio.play();
                buttonTitle = 'Play Again';
                message ='Game Over';
                break;
            default:
                buttonTitle = 'Start Game';
                message = "Let's start the game";
                break;
        }
        
        renderResultModal(requtedAction,buttonTitle,message);
    }

    function renderResultModal(requestAction,buttonTitle,message){
  
        let dialogView = new bootstrap.Modal(modelView);
        const myMessage = document.getElementById('messagTextId');
        myMessage.innerText = message;
     
        let playButtonView = document.getElementById('playBtnId');
        playButtonView.innerText = buttonTitle;
        playButtonView.addEventListener('click',()=>{
            dialogView.hide();
            // console.log(`clicked : ${requestAction}` );
            if(playButtonView.innerText === 'Start Game')
            {
                start = true;
                console.log(playButtonView.innerText);
            }else{
                start = false;
            }
            
            startGame();
        });

        dialogView.show();
    }

    // call functions
    showMessage(0);

}

window.addEventListener('DOMContentLoaded', init)