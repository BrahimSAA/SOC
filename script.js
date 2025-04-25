// Function to update section background color based on completion
function updateSectionBackground(sectionId, color) {
    const section = document.getElementById(sectionId);
    section.style.backgroundColor = color;
}

// Function to update section text color based on completion
function updateSectionTextColor(sectionId, color) {
    const section = document.getElementById(sectionId);
    section.style.color = color;
}

// Function to load completed sections and notes from localStorage on page load
function loadCompletedSections() {
  document.querySelectorAll(".section").forEach((section) => {
    const sectionId = section.id;
    const exist = localStorage.getItem(sectionId);

    // Load completion status and apply background color
    if (exist) {
      updateSectionBackground(sectionId, "#0d660d");
    }

    // Load and display notes from localStorage
    const notesTextArea = section.querySelector(".notes-input");
    const savedNotes = localStorage.getItem(`notes-${sectionId}`);
    if (savedNotes) {
      notesTextArea.value = savedNotes;
    }
  });
}

// Function to handle "Mark as Complete" button click
function handleCompleteButtonClick(button, section) {
    const sectionId = section.id;
    // Change background color and store completion status in localStorage
    updateSectionBackground(sectionId, '#0d660d');
    const sec = document.getElementById(sectionId);
    if (sec) {
        // Change the color of all text within the section
        sec.querySelectorAll('*').forEach(element => {
            if (element.tagName.toLowerCase() !== 'textarea') {
                element.style.color = "black";
            }
        });
    } else {
        console.error(`Section with ID ${sectionId} not found.`);
    }
    localStorage.setItem(sectionId, 'completed');
}

// Function to handle "Unmark" button click
function handleUnmarkButtonClick(button, section) {
    const sectionId = section.id;
    // Revert background color and remove completion status from localStorage
    updateSectionBackground(sectionId, 'rgb(24, 26, 27)');
    const sec = document.getElementById(sectionId);
    if (sec) {
        // Change the color of all text within the section
        sec.querySelectorAll('*').forEach(element => {
            if (element.tagName.toLowerCase() !== 'button') {
                element.style.color = "white";
            }
        });
    } else {
        console.error(`Section with ID ${sectionId} not found.`);
    }

    localStorage.removeItem(sectionId);
}

// Function to handle notes input and save them to localStorage
function handleNotesInput(section) {
    const sectionId = section.id;
    const notesTextArea = section.querySelector('.notes-input');
    notesTextArea.addEventListener('input', () => {
        const notes = notesTextArea.value;
        localStorage.setItem(`notes-${sectionId}`, notes);
    });
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load completed sections and notes from localStorage
    loadCompletedSections();

    // Add event listener to each "Mark as Complete" button
    document.querySelectorAll('.section').forEach(section => {
        const completeButton = section.querySelector('.complete-btn');
        const unmarkButton = section.querySelector('.unmark-btn');

        // Handle Mark as Complete button click
        completeButton.addEventListener('click', () => {
            handleCompleteButtonClick(completeButton, section);
        });

        // Handle Unmark button click
        unmarkButton.addEventListener('click', () => {
            handleUnmarkButtonClick(unmarkButton, section);
        });

        // Handle notes input for each section
        handleNotesInput(section);
    });
});

// Set the section title based on each video's filename
document.querySelectorAll('.section').forEach(section => {
    const videoTitle = section.querySelector('.video-title');
    if (videoTitle) {
        // Keep only the text starting from the word 'lesson'
        const lessonIndex = videoTitle.textContent.indexOf('lesson');
        if (lessonIndex !== -1) {
            videoTitle.textContent = videoTitle.textContent.substring(lessonIndex);
        }
    }
});

const carousel = document.querySelector(".carousel");
const leftArrow = document.getElementById("left");
const rightArrow = document.getElementById("right");
const currentCard = document.getElementById("actuel");

// Scroll to the "actuel" card on page load
document.addEventListener("DOMContentLoaded", () => {
    if (currentCard) {
        const carouselRect = carousel.getBoundingClientRect();
        const cardRect = currentCard.getBoundingClientRect();
        const offset = cardRect.left - carouselRect.left - carouselRect.width / 2 + cardRect.width / 2;

        carousel.scrollBy({
            left: offset,
            behavior: "smooth",
        });
    }
});

// Scroll left or right on arrow click
leftArrow.addEventListener("click", () => {
    carousel.scrollBy({
        left: -300,
        behavior: "smooth",
    });
});

rightArrow.addEventListener("click", () => {
    carousel.scrollBy({
        left: 300,
        behavior: "smooth",
    });
});

// Function to navigate between sections
function navigateToSection(direction, currentIndex) {
    const sections = document.querySelectorAll('.section');
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());

    // Ensure targetIndex stays within bounds
    if (targetIndex >= 0 && targetIndex < sections.length) {
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    } else if (direction === 'next') {
        alert('You are at the last video!');
    } else if (direction === 'prev') {
        alert('You are at the first video!');
    }
}

function navigate(targetPage) {
    window.location.href = targetPage;
}

// Get the button
const backToTopButton = document.getElementById('backToTop');

// Show the button when the user scrolls down 100px
window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
backToTopButton.onclick = function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

var titleContent = document.title;

// Export button functionality
document.getElementById('exportButton').addEventListener('click', function() {
    // Convert localStorage data to an object
    let localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }

    // Convert the object to a JSON string
    let jsonData = JSON.stringify(localStorageData);

    // Create a Blob from the JSON string
    let blob = new Blob([jsonData], { type: 'application/json' });

    // Create a link to download the file
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${titleContent}.json`;
    link.click();
});

// Import button functionality (trigger file input)
document.getElementById('importDataButton').addEventListener('click', function() {
    document.getElementById('importButton').click();
});

// Handle file input change event for importing data
document.getElementById('importButton').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                // Parse the JSON data from the file
                const jsonData = JSON.parse(e.target.result);

                // Loop through the parsed data and store it in localStorage
                for (const key in jsonData) {
                    if (jsonData.hasOwnProperty(key)) {
                        localStorage.setItem(key, JSON.stringify(jsonData[key]));
                    }
                }

                alert('Data imported successfully to localStorage!');
                location.reload(); // Refresh to show changes
            } catch (error) {
                alert('Error parsing JSON file');
            }
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        alert('Please select a valid JSON file');
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video");

  // Add play event listener to each video
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      // Pause all other videos
      videos.forEach((otherVideo) => {
        if (otherVideo !== video) {
          otherVideo.pause();
        }
      });
    });
  });
});