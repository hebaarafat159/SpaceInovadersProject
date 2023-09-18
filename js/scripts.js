function init() {

    /*----- CONSTANTS -----*/

      // start config
      const startingPosition = 0;
      let currentPosition = startingPosition;
  
    // movements keys
    // const MOVENETS_KEYS{
    //     UP_KEY_CODE: 38,
    //     const DOWN_KEY_CODE = 40;
    //     const RIGHT_KEY_CODE = 39;
    //     const LEFT_KEY_CODE = 37;
    // }

    /*----- STATE VARIABLES -----*/

    // Board Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;
   
     // create grid
     const grid = document.querySelector('.grid');

    /*----- EVENT LISTENERS listeners -----*/

    document.addEventListener('keyup', handleMovement);
    document.querySelector('body').addEventListener('keyup', handleMovement);


    /*----- FUNCTIONS -----*/
   
    // Create grid cells
    function createGrid()
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
            // cells.push(cell);
        }

       // add game elements in start positions       
       addElementOnGrid(startingPosition);
    }

    function addElementOnGrid(position)
    {
        const cellView = document.querySelector(`.grid > div:nth-child(${position + 1})`);   
        cellView.classList.add('spaceship');
    }

    function removeElementFromGrid(position)
    {
        const cellView = document.querySelector(`.grid > div:nth-child(${position + 1})`);
        cellView.classList.remove('spaceship');
    }

    function handleMovement(event){
       
        removeElementFromGrid(currentPosition);
        const pressedKey = event.keyCode;
        const UP_KEY_CODE = 38;
        const DOWN_KEY_CODE = 40;
        const RIGHT_KEY_CODE = 39;
        const LEFT_KEY_CODE = 37;
    
        switch(pressedKey){
            case UP_KEY_CODE:
                console.log("UP");
                currentPosition -= width;
                break;
            case DOWN_KEY_CODE:
                console.log("DOWN");
                currentPosition += width;
                break;
            case RIGHT_KEY_CODE:
                if(currentPosition % width !== (width-1))
                {
                    console.log("RIGHT");
                    currentPosition++;
                }
                break;
            case LEFT_KEY_CODE:
                if(currentPosition % width !== 0)
                {
                    console.log("LEFT");
                    currentPosition--;
                }
                break;
            default:
                removeElementFromGrid(currentPosition);
                break;
        }

        // Add current position
        addElementOnGrid(currentPosition)
    }
   
   
  
    // start the game callFunction
    createGrid();
    
}

window.addEventListener('DOMContentLoaded', init)