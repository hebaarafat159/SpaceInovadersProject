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

    // start config
    class Element {
        constructor(src, startingPosition){
            this.src = src;
            this.startingPosition = startingPosition;
            this.currentPosition = startingPosition;
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
                    console.log("Element UP");
                    this.currentPosition -= width;
                    break;
                case MOVENETS_KEYS.DOWN_KEY_CODE:
                    console.log("Element DOWN");
                    this.currentPosition += width;
                    break;
                case MOVENETS_KEYS.RIGHT_KEY_CODE:
                    if(this.currentPosition % width !== (width-1))
                    {
                        console.log("Element RIGHT");
                        this.currentPosition++;
                    }
                    break;
                case MOVENETS_KEYS.LEFT_KEY_CODE:
                    if(this.currentPosition % width !== 0)
                    {
                        console.log("Element LEFT");
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
            const cellView = document.querySelector(`.grid > div:nth-child(${this.currentPosition})`);
            cellView.classList.add(this.src);
        }
    
        hideFromGrid(position, element)
        {
            const cellView = document.querySelector(`.grid > div:nth-child(${this.currentPosition})`);
            cellView.classList.remove(this.src);
        }
    }

    class Player extends Element{
        constructor(startingPosition){
            super('spaceship', startingPosition);
            this.bolt = new Bolt(this.currentPosition+1);
        }
    }

    class Bolt extends Element{
        constructor(startingPosition){
            super('bolt', startingPosition);
        }

        shoot(){
            this.moveElement(MOVENETS_KEYS.UP_KEY_CODE);
        }
    }

    class Alien extends Element{
        constructor(startingPosition){
            super('alien', startingPosition);
        }
    }

    /*----- STATE VARIABLES -----*/

    // gird Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;

    const aliens = [];
    let player = null;

    // create grid
    const grid = document.querySelector('.grid');
    const startButton = document.

    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);

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
            position =  randomPsotion + (((height/2) -1 )* height); // (width - randomPsotion);
            console.log(`Random Position : ${randomPsotion}`);
            aliens.push(new Alien(position));
        }

        displayAliens(aliens);
    }


    function displayAliens(aliensArray)
    {
        aliensArray.map(alien => {
            alien.showInGrid();
        });
    }

    /**
     * this function is called by start game button and
     * it generates new game grid and initialize and render all the grid components.
     */
    function startGame(){
        // create new grid view
        renderGrid();

        // initialize player object and calculate it's first position.
        renderPlayer();

        // add many of aliens in random positions.
        // TODO change this calculation
        let totalAlientNumber = (height/2);
        console.log("Aliens : " + totalAlientNumber);
        renderAliens(totalAlientNumber);

        //TODO hide play again button and start game button.

        //TODO reset score value.
    }

    function handleMovement(event){
       
        const pressedKey = event.keyCode;
        console.log(pressedKey);
       
        switch(pressedKey){
            
            // case MOVENETS_KEYS.UP_KEY_CODE:
            //     console.log("UP");
            //     player.moveElement(MOVENETS_KEYS.RIGHT_KEY_CODE);
            //     break;
            // case MOVENETS_KEYS.DOWN_KEY_CODE:
            //     console.log("DOWN");
            //     player.moveElement(MOVENETS_KEYS.RIGHT_KEY_CODE);
            //     break;
            case MOVENETS_KEYS.RIGHT_KEY_CODE:
            case MOVENETS_KEYS.LEFT_KEY_CODE:
                player.moveElement(pressedKey);
                break;
            case MOVENETS_KEYS.SPACE_KEY_CODE:
                player.bolt.shoot();
                console.log('shooooooooooot');
                break;
        }
    }

    startGame();
}


window.addEventListener('DOMContentLoaded', init)