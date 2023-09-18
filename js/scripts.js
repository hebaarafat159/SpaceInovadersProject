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
            console.log('Element: ' + src);
            this.startingPosition = startingPosition;
            this.currentPosition = startingPosition;
        }

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
            console.log('Player: ' + this.src);
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
        constructor(startingPosition,index){
            super('alien', startingPosition);
            this.index = index;
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


    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);
    document.querySelector('body').addEventListener('keyup', handleMovement);

    /*----- FUNCTIONS -----*/
   
    // Create grid cells
    function initGrid()
    {
        // Use the cellCpint to create our grid cells
        for(let i = 0; i < cellCount; i++)
        {
            const cell = document.createElement('div');
            // Add index to div element.
            cell.innerText = i;
           
            // Add index as attribute
            cell.dataset.index = i;
            cell.dataset.data = null;
            // cell.setAttribute('data-index', i);
            cell.style.height = `${100/height}%`;
            cell.style.width = `${100/width}%`;

            // Add cell to grid
            grid.appendChild(cell);
        }
    }
   
    function startGame(){
        // create new grid view
        initGrid();

        // init and add it's starting position.
        // const playerStartPosition = if((cellCount/2) === 0) ? (cellCount/2) : (cellCount/2 + 1);
        const playerStartPosition = cellCount/2;
        player = new Player(playerStartPosition);
        player.showInGrid();

        // add many of aliens in random positions.

        // hide play again button and start game button.

        // reset score value.
    }

    function handleMovement(event){
       
        // removeElementFromGrid(currentPosition);
        const pressedKey = event.keyCode;
        console.log(pressedKey);
       
        switch(pressedKey){
            
            case MOVENETS_KEYS.UP_KEY_CODE:
                console.log("UP");
                player.moveElement(MOVENETS_KEYS.RIGHT_KEY_CODE);
                break;
            case MOVENETS_KEYS.DOWN_KEY_CODE:
                console.log("DOWN");
                player.moveElement(MOVENETS_KEYS.RIGHT_KEY_CODE);
                break;
            case MOVENETS_KEYS.RIGHT_KEY_CODE:
                console.log("RIGHT");
                player.moveElement(MOVENETS_KEYS.RIGHT_KEY_CODE);  
                break;
            case MOVENETS_KEYS.LEFT_KEY_CODE:
                console.log("LEFT");
                player.moveElement(MOVENETS_KEYS.LEFT_KEY_CODE);
                break;
            case MOVENETS_KEYS.SPACE_KEY_CODE:
                player.bolt.shoot();
                console.log('shooooooooooot');
                break;
            default:
                // remove from cell only 
                player.moveElement(-1);
                break;
        }
    }

    startGame();
}


window.addEventListener('DOMContentLoaded', init)