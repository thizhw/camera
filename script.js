const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const capturedImagesContainer = document.getElementById('capturedImages');
const camhead = document.getElementById('camhead');
const latestPhoto = document.getElementById('latestPhoto');
const submitButton = document.getElementById('submitButton'); 
const retakeButton = document.getElementById('retakeButton'); 

const headings = [
    'Front On Number Plate',
    'Front Full View of Vehicle with Number Plate',
    'Front on Left 30 degrees',
    'Front on Left 45 degrees',
    'Front on Right 30 degrees',
    'Front on Right 45 degrees',
    'Front take upside of number plate',
    'Back On Number Plate',
    'Back Full View of Vehicle with Number Plate',
    'Back on Left 30 degrees',
    'Back on Left 45 degrees',
    'Back on Right 30 degrees',
    'Back on Right 45 degrees',
    'Back take upside of number plate',
    'Random Pic 1 (number plate should be visible)',
    'Random Pic 2 (number plate should be visible)'
];

let currentHeadingIndex = 0;

async function startVideoStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } }
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL('image/png');

    // Create a new div for the captured image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('capturedImage');
    imageContainer.style.position = 'relative';

    // Add heading for the image
    const heading = document.createElement('h3');
    heading.innerText = headings[currentHeadingIndex];
    heading.style.fontSize = '14px';
    heading.style.marginBottom = '5px';
    imageContainer.appendChild(heading);

    // Create and append the captured image
    const imgElement = document.createElement('img');
    imgElement.src = photo;
    imgElement.style.width = '100px';
    imgElement.style.height = 'auto';
    imageContainer.appendChild(imgElement);

    // Add a remove button to the image container
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.position = 'absolute';
    removeButton.style.top = '5px';
    removeButton.style.right = '5px';
    removeButton.style.padding = '5px 10px';
    removeButton.style.fontSize = '12px';
    removeButton.style.backgroundColor = '#FF5C5C';
    removeButton.style.color = 'white';
    removeButton.style.border = 'none';
    removeButton.style.cursor = 'pointer';
    removeButton.style.borderRadius = '3px';

    // Add event listener to remove the image container when clicked
    removeButton.addEventListener('click', () => {
        imageContainer.remove();
        // Adjust logic to recapture the photo
        currentHeadingIndex--; // Step back to the previous heading
        camhead.textContent = headings[currentHeadingIndex];
        captureButton.style.display = 'block'; // Show capture button again
        camhead.style.display = 'block'; // Show heading again
        submitButton.style.display = 'none'; // Hide submit button
        retakeButton.style.display = 'none'; // Hide retake button
    });

    imageContainer.appendChild(removeButton);
    capturedImagesContainer.appendChild(imageContainer);

    // Update the latest photo beside the capture button
    latestPhoto.src = photo;

    // Move to the next heading
    currentHeadingIndex++;

    // Update the displayed heading or show submit button if all images are captured
    if (currentHeadingIndex < headings.length) {
        camhead.textContent = headings[currentHeadingIndex];
    } else {
        camhead.style.display = 'none';
        captureButton.style.display = 'none';
        submitButton.style.display = 'block';
        retakeButton.style.display = "block";
    }
});

// Add functionality to the Submit button
submitButton.addEventListener('click', () => {
    alert('All images captured! Submitting...');
});

// Start video stream only if vehicle number is entered
let vehicleNumber = prompt("Enter the vehicle number:");

if (!vehicleNumber) {
    alert("Vehicle number is required to proceed!");
} else {
    startVideoStream();
}

