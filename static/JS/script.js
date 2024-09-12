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
    const length = path.getTotalLength();;
  
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
  

    if (newSection == 'home-wrapper') {
        animatePathDrawing();
      } else{
        unAnimatePathDrawing();
      }
    

    // Start the animation
  
      const currentEl = document.querySelector(`.${currentSection}`);
      const newEl = document.querySelector(`.${newSection}`);
      console.log(currentEl);
      console.log(newEl);
  
      // Hide current section
      currentEl.classList.remove('show');
      newEl.style.opacity = 0;
      currentEl.style.display="none";
  
      // Show new section after a slight delay for the fade effect
      setTimeout(() => {
          newEl.style.display="flex";
          newEl.style.opacity = 1;
          newEl.classList.add('show');
      }, 10); // Short delay to ensure the class removal has processed
  
      currentSection = newSection; // Update the current visible section
  }

  document.addEventListener('DOMContentLoaded', () => {
    showSection('home-wrapper'); // Show the home section by default
  })
  
  