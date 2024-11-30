// loadingScreen.js

// Show or hide the loading screen
const LoadingScreen = (() => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const loadingText = document.getElementById('loading-text');
  
    // Show loading screen
    const show = () => {
      if (loadingScreen) {
        loadingScreen.style.display = 'flex'; // Show the loading screen
      }
      if (mainContent) {
        mainContent.style.display = 'none'; // Hide main content
      }
    };
  
    // Update loading progress (optional)
    const updateProgress = (progress) => {
      if (loadingText) {
        loadingText.textContent = `Loading... ${progress}%`;
      }
    };
  
    // Hide loading screen
    const hide = () => {
      if (loadingScreen) {
        loadingScreen.style.display = 'none'; // Hide the loading screen
      }
      if (mainContent) {
        mainContent.style.display = 'block'; // Show main content
      }
    };
  
    return {
      show,
      updateProgress,
      hide,
    };
  })();
  
  // Wait for the window to fully load
  window.addEventListener('load', () => {
    LoadingScreen.hide();
  });
  
