const dpkCursor = document.createElement("div");
dpkCursor.classList.add("dpkCursor");
document.body.appendChild(dpkCursor);


function initCursor(speedOption = 0.25) {
  
    let dpkCursorMouse = { x: -100, y: -100 };
    let dpkCursorPos = { x: 0, y: 0 };
    let speed = speedOption;
   
    //center the circle around cursor       
 
    window.addEventListener("mousemove", (e) => {
      dpkCursorMouse.x = e.x;
      dpkCursorMouse.y = e.y;
    });

    const updatePosition = () => {
      dpkCursorPos.x += (dpkCursorMouse.x - dpkCursorPos.x) * speed;
      dpkCursorPos.y += (dpkCursorMouse.y - dpkCursorPos.y) * speed;

      dpkCursor.style.transform = `translate3d(calc(${dpkCursorPos.x}px - 50%) ,calc(${dpkCursorPos.y}px - 50%),0)`;
    
    };

    function loop() {
      updatePosition();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  
}


initCursor()

function updateTimestamp() {
    // Create a new Date object for the current date and time
    const now = new Date();
    
    // Format the time as "hour:minute"
    // Adjust hours for 12-hour format and pad minutes with leading zeros if needed
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Pad minutes with leading zero if needed
    const minutesPadded = minutes < 10 ? '0'+minutes : minutes;
    
    // Combine the formatted parts into a final time string
    const formattedTime = `${hours}:${minutesPadded}`;
  
    // Find the <p> element with the id="timestamp"
    let elems = document.querySelectorAll(".timestamp");

  
    // Update the content of the <p> element with the formatted time
    for (let i = 0; i < elems.length; i++) elems[i].textContent = `${formattedTime} `;
  }
  
  // Call the function to update the timestamp
  updateTimestamp();

  let currentSection = 'home-wrapper'; // Track the current visible section

  function showSection(newSection) {
    updateTimestamp();
    const path = document.querySelector('svg path');
    const length = path.getTotalLength();

    // Set up the initial state of the path
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Define the animation function with a delay
    const animatePathDrawing = () => {
      setTimeout(() => { // Add a delay before starting the animation
        path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
        path.style.strokeDashoffset = '0';
      }, 1000); // Delay in milliseconds (1000ms = 1 second)
      setTimeout(unAnimatePathDrawing, 4000);
    };

    function unAnimatePathDrawing() {
        // No need for an additional delay here since it's already delayed by the first animation
        path.style.transition = 'stroke-dashoffset 2s ease-in-out';
        path.style.strokeDashoffset = length; // Reset to original length
        setTimeout(animatePathDrawing, 4000);
    };
  

    // Update this part to handle the new structure
    if (newSection === 'home-wrapper') {
      animatePathDrawing();
    } else {
      unAnimatePathDrawing();
    }

    const currentEl = document.querySelector(`.${currentSection}`);
    const newEl = document.querySelector(`.${newSection}`);

    // Hide current section
    currentEl.classList.remove('show');
    newEl.style.opacity = 0;
    currentEl.style.display = "none";

    // Show new section after a slight delay for the fade effect
    setTimeout(() => {
      newEl.style.display = "flex";
      newEl.style.opacity = 1;
      newEl.classList.add('show');
    }, 10);

    currentSection = newSection; // Update the current visible section
  }

  document.addEventListener('DOMContentLoaded', () => {
    showSection('home-wrapper'); // Show the home section by default
  })

function navigateTo(destination) {
    // Ensure the terminal is initialized and visible
    initializeTerminal();
    
    // Focus on the input
    const inputElement = document.querySelector('.terminal-input');
    if (inputElement) {
        inputElement.focus();

        // Get the current directory
        const currentPath = getCurrentDirectory();

        // Construct the command
        let command;
        if (destination === '~') {
            command = 'cd ~';
        } else if (currentPath.endsWith('/skills') || currentPath.endsWith('/projects') || currentPath.endsWith('/contact')) {
            if (['skills', 'projects', 'contact'].includes(destination)) {
                command = `cd ../${destination}`;
            } else {
                command = `cd ${destination}`;
            }
        } else {
            command = `cd ${destination}`;
        }

        // Set the input value
        inputElement.value = command;

        // Trigger the Enter key event
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
        });
        inputElement.dispatchEvent(event);
    } else {
        console.error('Terminal input not found');
    }
}

function initializeTerminal() {
    const terminalWrapper = document.querySelector('.terminal-wrapper');
    if (terminalWrapper) {
        terminalWrapper.style.display = 'flex';
    } else {
        console.error('Terminal wrapper not found');
    }
}

// Ensure the terminal is initialized when the page loads
document.addEventListener('DOMContentLoaded', initializeTerminal);

// Helper function to get the current directory
function getCurrentDirectory() {
    const promptElement = document.querySelector('.prompt');
    if (promptElement) {
        const promptText = promptElement.textContent.trim();
        const match = promptText.match(/\[raybao@devray (.*?)\]\$/);
        return match ? match[1] : '';
    }
    return '';
}
