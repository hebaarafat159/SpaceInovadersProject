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

    const DROP_DUM_TIME_INTERVAL = 1000;
    const DROP_MOVING_TIME_INTERVAL = 2000;
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


    const aliens = [];
    let player = null;

    // gird Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;

    // create grid
    const gridView = document.querySelector('.grid');
    const buttons = document.querySelectorAll('button');
    const scoreView = document.getElementById('score');
    const livesView = document.getElementById('lives');
    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);
    buttons.forEach((button) => button.addEventListener('click', startGame));
    
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
            this.bolt = null;//new Bolt(this.currentPosition);
        }
        shoot(){
            if(this.bolt === null)
                this.bolt = new Bolt(this.currentPosition);
            let hasNext = this.bolt.moveElement(MOVENETS_KEYS.UP_KEY_CODE);
            if(!hasNext)
            {
                this.bolt.hideFromGrid();
                this.bolt.currentPosition = player.currentPosition;
                clearShootBoltTimmer();
            }   
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

        moveDown(){
            this.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);
        }

        movingBum(){
            if( this.bum === null || this.bum === undefined)
            {
                this.bum = new Bum(this.currentPosition);
                // console.log(`the bum current location ${this.bum.currentPosition}`);
            }
            // console.log(this.bum);
            this.bum.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);  
        }

        // dropBum(){
        //     // bumMovingTimmer = setInterval(this.movingBum,DROP_MOVING_TIME_INTERVAL);
        //     // this.movingBum();
        // }
    }

    class Bum extends Element{
        constructor(startingPosition){
            super(ELEMENTS_SRC_KEYS.bum, startingPosition);
        }
    }

    /*----- FUNCTIONS -----*/
  
    /**
     * this function is called by start game button and
     * it generates new game grid and initialize and render all the grid components.
     */
   function startGame(){
        // reset variables
        resetGameVariabes();

        // create new grid view
        renderGrid();

        // initialize player object and calculate it's first position.
        renderPlayer();

        // change this calculation
        let totalAlientNumber = (height/2);
        renderAliens(totalAlientNumber);

        // hide play again button and start game button.
        buttons.forEach((element => element.style.visibility = 'hidden'));
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
            // Add index to div element.
            // cell.innerText = i;
           
            // Add index as attribute
            cell.dataset.index = i;
            // cell.setAttribute('data-index', i);
            cell.style.height = `${100/height}%`;
            cell.style.width = `${100/width}%`;

            // Add cell to grid
            gridView.appendChild(cell);
        }
    }
   
    /**
     * this function calculates player starting posotion 
     * and creates player object with the initial values
     */
    function renderPlayer(){
         // calculate player starting position
         const playerStartPosition = (cellCount - width) + (height/2) ;
         player = new Player(playerStartPosition);
         player.showInGrid();
    }

    /**
     * this function create and display aliens list in the row, 
     * after it calculate it's starting position. 
     * @param {*} totalAlientNumber // number of aliens shoould be displayed in the window.
     */
    function renderAliens(totalAlientNumber){
        // calculate number of aliens in each row.
        let position = 0;
        let randomPsotion = 0; 
        // create array list of Alien objects.
        for(let i=0; i < totalAlientNumber; i++)
        {
            randomPsotion = Math.floor(Math.random() * (width-1))
            position =  randomPsotion + (((height/2) -1 )* height);
            aliens.push(new Alien(position));
        }

        displayAliens(aliens);

        // init timmers
        aliensTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
        //TODO set timmer to drop a bum.
        dropBumTimmer = setInterval(startDropBumTimmer,DROP_DUM_TIME_INTERVAL);
    }

    function displayAliens(aliensArray)
    {
        aliensArray.map(alien => {
            alien.showInGrid();
        });
    }

    // start timmers
    function startAliensTimmer() {
        aliens.forEach((alien) => alien.moveDown());
        // check plater is hidden or not 
        isPlayerBeenHitten();
    }

    function startDropBumTimmer() {
        let selectRandemAlienIndex = Math.floor(Math.random() * (aliens.length))
        let selectedAlien = aliens[selectRandemAlienIndex];
        // console.log(`selected Index : ${selectRandemAlienIndex} , alient object : ${selectedAlien.currentPosition}` );
        selectedAlien.movingBum();
         // check plater is hidden or not 
         isPlayerBeenHitten();
    }

    /**
     * this function check if the player has been hiten by an alien or a bum.
     */
    function isPlayerBeenHitten(){
        let isHitten = false;

        for(let i = 0; i < aliens.length; i++)
        {
            if(aliens[i].currentPosition === player.currentPosition || (aliens[i].bum !== null && aliens[i].bum.currentPosition === player.currentPosition)){
                isHitten = true;
                // console.log(`the player has been hitten !!!!!`);
                break;
            }else{
                isHitten = false;
            }
        }

        if(isHitten)
        {
            console.log(`the player has been hitten !!!!!`);
            // TODO discrease score or dicrease number of hearts
            updateLiversNumber(-1);
            // TODO display gameover view 
        }
    }

    function startShootBoltTimmer() {
        player.shoot();
        shootAliensAndBums();
        // check if player winnes
        isPlayerWin();
    }

    function isPlayerWin(){
        if(aliens.length === 0)
            showFinalMessage(true);
    }
    /**
     * hide and reomver hitted aliens from aliens array,
     * hide and delete bum,
     * and increase score 
     */
    function shootAliensAndBums(){
        
        for(let i = 0; i < aliens.length; i++)
        {
            // check if the bolt shoot an alien
            if(player.bolt.currentPosition === aliens[i].currentPosition){
                // console.log(`Aliens Hited`);
                aliens[i].hideFromGrid();
                aliens.splice(i,1);
                updateScore(1, SCORE_ALIENT_RANGE);
            }
            
            // check if the bolt shoot a bum
            let bumObject = aliens[i].bum;
            if((bumObject!==null) && (player.bolt.currentPosition === bumObject.currentPosition))
            {
                console.log(`Bum Hited`);
                aliens[i].bum.hideFromGrid();
                updateScore(1, SCORE_BUM_RANGE);
            }
        }
        // console.log(aliens);
    }

    // stop timmers
    function stopAllTimers(){
        clearAliensTimmer();
        clearDropBumTimmer();
        clearShootBoltTimmer();
        clearMovingBumTimmer();
    }

    function clearAliensTimmer(){
        if(aliensTimmer!==null)
            clearInterval(aliensTimmer);
    }

    function clearDropBumTimmer(){
        if(dropBumTimmer!==null)
            clearInterval(dropBumTimmer);
    }

    function clearShootBoltTimmer(){
        if(shootBoltTimmer!==null)
            clearInterval(shootBoltTimmer);
    }

    function clearMovingBumTimmer(){
        if(bumMovingTimmer!==null)
            clearInterval(bumMovingTimmer);
    }

    function resetGameVariabes(){
        const aliens = [];
        let player = null;
        updateScore(0,0); 
        updateLiversNumber(0);
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
    function updateLiversNumber(functioRequest){
        switch(functioRequest){
            case 1:
                break;
            // remove live    
            case -1:
               if(livesView.hasChildNodes())
                {
                    livesView.removeChild(livesView.lastChild);
                }else
                {
                    showFinalMessage(false);
                }
                break;    
            // reset lives    
            default:
                for(let i=0; i< LIVES_MAX_NUMBERS; i++)
                {
                    let live = document.createElement('div');
                    live.classList.add(ELEMENTS_SRC_KEYS.player);
                    livesView.appendChild(live);
                }
                break; 
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
                stopAllTimers();
                break;
            case MOVENETS_KEYS.RIGHT_KEY_CODE:
            case MOVENETS_KEYS.LEFT_KEY_CODE:
                player.moveElement(pressedKey);
                if(player.bolt !== null && player.bolt !== undefined)
                    player.bolt.startingPosition = player.currentPosition;
                break;
            case MOVENETS_KEYS.SPACE_KEY_CODE:
                console.log('shooooooooooot');
                shootBoltTimmer = setInterval(startShootBoltTimmer, SHOOT_BOLT_TIME_INTERVAL);
                break;
        }
    }

    /**
     * this function display the final message
     * and display 'Play again' button 
     * @param {*} isWinner // true if the player wins, false if he lose all his lives
     */
    function showFinalMessage(isWinner){
        let message = '';
        
        if(isWinner)
            message = `Congratulation you win with score of ${getScoreValue}`;
        else
            message ='Game Over'
        
        stopAllTimers();
        //TODO show modal
        alert(message);
    }

    // call functions
    startGame();

}

window.addEventListener('DOMContentLoaded', init)