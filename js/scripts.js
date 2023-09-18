function init() {

    // ! Variables & Elements
    // ? Elements
    // create grid
    const grid = document.querySelector('.grid');

    // ? variables
    // Board Config
    const width = 10;
    const height = 10;
    const cellCount = width * height;
    // let cells = [];
    // {
    //     UP_KEY_CODE: 38,
    //     const DOWN_KEY_CODE = 40;
    //     const RIGHT_KEY_CODE = 39;
    //     const LEFT_KEY_CODE = 37;
    // }
    

    // start config
    const startingPosition = 0;
    let currentPosition = startingPosition;

    // ! FUNCTIONS
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

        // Add cat image to starting position
        // console.log(cells);
        addCat(startingPosition);
    }

    function addCat(position)
    {
        const cellView = document.querySelector(`.grid > div:nth-child(${position + 1})`);   
        cellView.classList.add('cat');
    }

    function removeCat(position)
    {
        const cellView = document.querySelector(`.grid > div:nth-child(${position + 1})`);
        cellView.classList.remove('cat');
    }

    function handleMovement(event){
        // console.log(event);
        // console.log(event.keyCode);

        removeCat(currentPosition);
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
                removeCat(currentPosition);
                break;
        }

        // Add current position
        addCat(currentPosition)
    }
   
    // ! EVENT
    document.addEventListener('keyup', handleMovement);

    // ! functions calls
    createGrid();
    
}

window.addEventListener('DOMContentLoaded', init)