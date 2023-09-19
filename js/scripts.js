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

    const DROP_DUM_TIME_INTERVAL = 1000;
    const SHOOT_BOLT_TIME_INTERVAL = 1000;
    const MOVING_ALIEN_DOWN_TIME_INTERVAL = 1000;

    // init timmers
    // TODO set timmer to move aliens down.
    let aliensTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
    // let dropBumTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
    let shootBoltTimmer = setInterval(startShootBoltTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);

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
            this.hideFromGrid(this.currentPosition);
            switch(movingDirection){
                case MOVENETS_KEYS.UP_KEY_CODE:
                    if(this.currentPosition > width)
                    {
                        this.currentPosition -= width;
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
            super('spaceship', startingPosition);
            this.bolt = null;//new Bolt(this.currentPosition);
        }
        shoot(){
            if(this.bolt === null)
                this.bolt = new Bolt(this.currentPosition);
            this.bolt.moveElement(MOVENETS_KEYS.UP_KEY_CODE);
        }
    }

    class Bolt extends Element{
        constructor(startingPosition){
            super('bolt', startingPosition);
        }
    }

    class Alien extends Element{
        constructor(startingPosition){
            super('alien', startingPosition);
            this.bum = null;
        }

        moveDown(){
            this.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);
        }

        dropBum(){
            this.bum = new Bum(this.currentPosition);
            this.bum.drop();
        }
    }

    class Bum extends Element{
        constructor(startingPosition){
            super('bum', startingPosition);
        }

        drop(){
            while(this.currentPosition < (cellCount-width))
            {
                this.moveElement(MOVENETS_KEYS.DOWN_KEY_CODE);
            }
        }
    }
    /*----- STATE VARIABLES -----*/

    const aliens = [];
    let player = null;
    let score = 0;

    // gird Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;

    // create grid
    const grid = document.querySelector('.grid');
    const buttons = document.querySelectorAll('button');

    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);
    buttons.forEach((button) => button.addEventListener('click', startGame));
    
    /*----- FUNCTIONS -----*/
   
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
            cell.innerText = i;
           
            // Add index as attribute
            cell.dataset.index = i;
            // cell.setAttribute('data-index', i);
            cell.style.height = `${100/height}%`;
            cell.style.width = `${100/width}%`;

            // Add cell to grid
            grid.appendChild(cell);
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

        // TODO set timmer to move aliens down.
    
        // Todo set timmer to drop a bum.
    }


    function displayAliens(aliensArray)
    {
        aliensArray.map(alien => {
            alien.showInGrid();
        });
    }


    function resetGameVariabes(){
        const aliens = [];
        let player = null;
        let score = 0;    
    }

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

    function handleMovement(event){
       
        const pressedKey = event.keyCode;
        
        switch(pressedKey){
            
            case MOVENETS_KEYS.UP_KEY_CODE:
                console.log("UP");
                player.bolt.moveElement(MOVENETS_KEYS.UP_KEY_CODE);
                break;
            case MOVENETS_KEYS.DOWN_KEY_CODE:
                console.log("DOWN");
                stopAllTimers();
                break;
            case MOVENETS_KEYS.RIGHT_KEY_CODE:
            case MOVENETS_KEYS.LEFT_KEY_CODE:
                player.moveElement(pressedKey);
                break;
            case MOVENETS_KEYS.SPACE_KEY_CODE:
                console.log('shooooooooooot');
                shootBoltTimmer = setInterval(startShootBoltTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
                break;
        }
    }

    startGame();


    // init timmers
    // TODO set timmer to move aliens down.
    aliensTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
    // let dropBumTimmer = setInterval(startAliensTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);
    // let shootBoltTimmer = setInterval(startShootBoltTimmer, MOVING_ALIEN_DOWN_TIME_INTERVAL);

    // start timmers
    function startAliensTimmer() {
            aliens.forEach((alien) => alien.moveDown());
    }

    function startShootBoltTimmer() {
        player.shoot();
    }
    
    // stop timmers
    function stopAllTimers(){
        clearAliensTimmer();
       // clearDropBumTimmer();
        clearShootBoltTimmer();
    }

    function clearAliensTimmer(){
            clearInterval(aliensTimmer);
    }
    
    function clearDropBumTimmer(){
        clearInterval(dropBumTimmer);
    }

    function clearShootBoltTimmer(){
        clearInterval(shootBoltTimmer);
    }
}

window.addEventListener('DOMContentLoaded', init)