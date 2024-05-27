
const imageContainer = document.getElementById('image-container');
const zoomedImage = document.getElementById('zoomed-image');
const choices = document.querySelectorAll('.choice-button');
const submitButton = document.getElementById('submit-button');
const correctCountDisplay = document.getElementById('correct-count');
const finishedMessage = document.getElementById('finished-message');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const upArrow = document.getElementById('up-arrow');
const downArrow = document.getElementById('down-arrow');

let images = ['AKCaseHardened.png',
'DesertHydra.png',
'AWPRedLine.png',
'AWPFade.png',
'M4ControlPanel.png',
'TEC9RemoteControl.png',
'XMIrezumi.png',
'AUGRandomAccess.png',
'MAGCoreBreach.png',
'AWPAcheron.png',
'AKPointDisarray.png',
'M4RoyalPaladin.png',
'P90Shapewood.png',
'PPFuelRod.png',
'FSRetrobution.png',
'AWPDragonLore.png']; // Texture images
let skinsFolder = ['AKCaseHardened.png',
'DesertHydra.png',
'AWPRedLine.png',
'AWPFade.png',
'M4ControlPanel.png',
'TEC9RemoteControl.png',
'XMIrezumi.png',
'AUGRandomAccess.png',
'MAGCoreBreach.png',
'AWPAcheron.png',
'AKPointDisarray.png',
'M4RoyalPaladin.png',
'P90Shapewood.png',
'PPFuelRod.png',
'FSRetrobution.png',
'AWPDragonLore.png']; // Correct choices
let currentIndex = 0;
let correctIndex;
let correctChoices = 0;
let attempts = 0;
const maxAttempts = 10;

function loadRandomImage() {
    currentIndex = Math.floor(Math.random() * images.length);
    correctIndex = currentIndex; // Assume same index is correct
    zoomedImage.src = `../images/${images[currentIndex]}`;
    zoomedImage.style.left = '0px';
    zoomedImage.style.top = '0px'; // Reset top position
    zoomedImage.style.bottom = '0px';
    zoomedImage.style.right = '0px';
    zoomedImage.style.width = 'auto'; // Reset width to auto
    zoomedImage.style.height = 'auto'; // Reset height to auto
    
    // Apply black and white filter
    zoomedImage.style.filter = 'grayscale(100%)';
}

function loadChoices() {
    let availableChoices = [...skinsFolder]; // Create a copy of skinsFolder to track available choices
    let correctChoice = skinsFolder[correctIndex];
    
    // Remove the correct choice from availableChoices
    availableChoices = availableChoices.filter(choice => choice !== correctChoice);

    // Shuffle availableChoices
    availableChoices.sort(() => 0.5 - Math.random());

    // Determine the number of choices to display (including the correct choice)
    const numChoicesToShow = Math.min(choices.length, availableChoices.length + 1);

    // Randomly select a few choices from availableChoices (including the correct choice)
    let selectedChoices = availableChoices.slice(0, numChoicesToShow - 1);
    selectedChoices.push(correctChoice);

    // Fill remaining choices with randomly selected options from the pool of skins
    while (selectedChoices.length < numChoicesToShow) {
        let randomIndex = Math.floor(Math.random() * skinsFolder.length);
        let randomChoice = skinsFolder[randomIndex];
        if (!selectedChoices.includes(randomChoice)) {
            selectedChoices.push(randomChoice);
        }
    }

    // Shuffle the selected choices
    selectedChoices.sort(() => 0.5 - Math.random());

    // Assign choices to choice buttons
    choices.forEach((choice, index) => {
        let skinImg;
        if (index < selectedChoices.length) {
            skinImg = new Image();
            skinImg.src = `../FullSkins/${selectedChoices[index]}`;
            choice.dataset.choice = selectedChoices[index];
        }
        choice.innerHTML = ''; // Clear previous content
        choice.appendChild(skinImg || document.createTextNode("")); // Append the image or an empty text node
    });
}

function checkChoice(choice) {
    return choice === skinsFolder[correctIndex]; // Compare file names instead of full paths
}

function handleArrowClick(direction) {
    let left = parseInt(zoomedImage.style.left) || 0;
    let top = parseInt(zoomedImage.style.top) || 0;
    let containerWidth = imageContainer.clientWidth;
    let containerHeight = imageContainer.clientHeight;

    // Calculate the maximum allowable left and top positions
    let maxLeft = 0;
    let maxTop = 0;
    let minLeft = -(zoomedImage.width - containerWidth);
    let minTop = -(zoomedImage.height - containerHeight);

    if (direction === 'left') {
        left = Math.min(maxLeft, left + movementSpeed);
    } else if (direction === 'right') {
        left = Math.max(minLeft, left - movementSpeed);
    } else if (direction === 'up') {
        top = Math.min(maxTop, top + movementSpeed);
    } else if (direction === 'down') {
        top = Math.max(minTop, top - movementSpeed);
    }

    // Update the position of the zoomed-in image
    zoomedImage.style.left = `${left}px`;
    zoomedImage.style.top = `${top}px`;
}


leftArrow.addEventListener('click', () => handleArrowClick('left'));
rightArrow.addEventListener('click', () => handleArrowClick('right'));
upArrow.addEventListener('click', () => handleArrowClick('up'));
downArrow.addEventListener('click', () => handleArrowClick('down'));

submitButton.addEventListener('click', () => {
    if (attempts >= maxAttempts) return;
    let selectedChoice = document.querySelector('.choice-button.selected');
    if (selectedChoice) {
        if (checkChoice(selectedChoice.dataset.choice)) {
            correctChoices++;
            Swal.fire({
                icon: 'success',
                title: 'Correct Skin!',
                showConfirmButton: false,
                timer: 1000
            }); // Pop up for correct choice
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Wrong Skin!',
                showConfirmButton: false,
                timer: 1000
            }); // Pop up for wrong choice
        }
        attempts++;
        correctCountDisplay.innerText = `Correct Choices: ${correctChoices}`;
        if (attempts >= maxAttempts) {
            Swal.fire({
                title: 'Finished!',
                text: `You guessed correctly ${correctChoices} times out of 10. Press OK to Refresh.`,
                showCancelButton: false,
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Reload the page
                }
            });
        } else {
            loadRandomImage();
            loadChoices();
        }
        selectedChoice.classList.remove('selected'); // Remove selected class
    }
});

choices.forEach(choice => {
    choice.addEventListener('click', () => {
        choices.forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
    });
});

loadRandomImage();
loadChoices();

// Define a variable to keep track of whether the button is being held down
let isButtonDown = false;

// Add event listeners for mousedown and mouseup events on the arrow buttons
leftArrow.addEventListener('mousedown', () => startMoving('left'));
rightArrow.addEventListener('mousedown', () => startMoving('right'));
upArrow.addEventListener('mousedown', () => startMoving('up'));
downArrow.addEventListener('mousedown', () => startMoving('down'));
document.addEventListener('mouseup', stopMoving);

// Function to start moving the image continuously when the button is held down
function startMoving(direction) {
    isButtonDown = true;
    // Define a function to continuously move the image until the button is released
    function move() {
        if (isButtonDown) {
            handleArrowClick(direction);
            requestAnimationFrame(move); // Request next frame to keep moving
        }
    }
    move(); // Start moving initially
}

// Function to stop moving the image when the button is released
function stopMoving() {
    isButtonDown = false;
}

// Define a variable to control the speed of movement
const movementSpeed = 50; // Adjust this value to change the speed

// Function to start moving the image continuously when the button is held down
function startMoving(direction) {
    isButtonDown = true;
    // Define a function to continuously move the image until the button is released
    function move() {
        if (isButtonDown) {
            handleArrowClick(direction);
            setTimeout(move, 50); // Adjust the timeout to control the speed
        }
    }
    move(); // Start moving initially
}
