const imageContainer = document.getElementById('image-container');
const zoomedImage = document.getElementById('zoomed-image');
const choices = document.querySelectorAll('.choice-button');
const submitButton = document.getElementById('submit-button');
const correctCountDisplay = document.getElementById('correct-count');
const finishedMessage = document.getElementById('finished-message');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

let images = ['image1.png', 'image2.png', 'image3.png']; // Example images
let skinsFolder = ['image1.png', 'image2.jpg', 'image3_skin.jpg']; // Correct choices
let currentIndex = 0;
let correctIndex;
let correctChoices = 0;
let attempts = 0;
const maxAttempts = 10;

function loadRandomImage() {
    currentIndex = Math.floor(Math.random() * images.length);
    correctIndex = currentIndex; // Assume same index is correct
    zoomedImage.src = `images/${images[currentIndex]}`;
    zoomedImage.style.left = '0px';
}

function loadChoices() {
    let choicesArray = [...skinsFolder];
    choicesArray.sort(() => 0.5 - Math.random());
    choices.forEach((choice, index) => {
        choice.innerText = `Skin ${index + 1}`;
        choice.dataset.choice = choicesArray[index];
    });
}

function checkChoice(choice) {
    return choice === `images/${skinsFolder[correctIndex]}`;
}

function handleArrowClick(direction) {
    let left = parseInt(zoomedImage.style.left) || 0;
    if (direction === 'left' && left < 0) {
        zoomedImage.style.left = `${left + 50}px`;
    } else if (direction === 'right' && left > -2000) {
        zoomedImage.style.left = `${left - 50}px`;
    }
}

leftArrow.addEventListener('click', () => handleArrowClick('left'));
rightArrow.addEventListener('click', () => handleArrowClick('right'));

submitButton.addEventListener('click', () => {
    if (attempts >= maxAttempts) return;
    let selectedChoice = document.querySelector('.choice-button.selected');
    if (selectedChoice) {
        if (checkChoice(selectedChoice.dataset.choice)) {
            correctChoices++;
            alert("Correct Choice!"); // Pop up for correct choice
        } else {
            alert("Wrong Choice!"); // Pop up for wrong choice
        }
        attempts++;
        correctCountDisplay.innerText = `Correct Choices: ${correctChoices}`;
        if (attempts >= maxAttempts) {
            finishedMessage.style.display = 'block';
            finishedMessage.innerText = `Finished! You guessed correctly ${correctChoices} times.`;
        } else {
            loadRandomImage();
            loadChoices();
        }
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
const movementSpeed = 2; // Adjust this value to change the speed

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