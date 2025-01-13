// loadingScreen.js with special effects

const LoadingScreen = (() => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  const loadingText = document.getElementById('loading-text');

  const show = () => {
    if (loadingScreen) {
      loadingScreen.style.opacity = 1;
      loadingScreen.style.display = 'flex';
    }
    if (mainContent) {
      mainContent.style.opacity = 0;
      mainContent.style.display = 'none';
    }
  };
  

  const loadingPercent = document.getElementById('loading-percent');

  const updateProgress = (progress) => {
    if (loadingText) {
      loadingText.textContent = `Loading... ${progress}%`;
      loadingText.style.animation = 'fadeInOut 1s ease-in-out infinite';
    }
    if (loadingPercent) {
      loadingPercent.textContent = `${progress}%`; // Update the loading percentage
    }
  };
  

  // Hide loading screen with fade-out effect
  const hide = () => {
    if (loadingScreen) {
      loadingScreen.style.transition = 'opacity 0.5s ease-in-out';
      loadingScreen.style.opacity = 0;
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
    if (mainContent) {
      mainContent.style.display = 'block';
      setTimeout(() => {
        mainContent.style.transition = 'opacity 0.5s ease-in-out';
        mainContent.style.opacity = 1;
      }, 10);
    }
  };

  return {
    show,
    updateProgress,
    hide,
  };
})();

// Dynamically add fadeInOut animation keyframes
const addFadeInOutAnimation = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

addFadeInOutAnimation();

// Manage modal functionality
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('close-modal');
  const startBtn = document.getElementById('start-btn');

  const hideModal = () => {
    if (modal) modal.style.display = 'none';
  };

  const showModal = () => {
    if (modal) modal.style.display = 'flex';
  };

  if (closeModal) closeModal.addEventListener('click', hideModal);
  if (startBtn) startBtn.addEventListener('click', hideModal);

  window.addEventListener('load', () => {
    LoadingScreen.hide(); // Hide loading screen
    setTimeout(() => {
      showModal(); // Show modal after loading screen hides
    }, 600); // Ensure delay matches loading screen fade-out
  });
});
let progress = 0; // Initialize progress
LoadingScreen.show(); // Show loading screen

const progressInterval = setInterval(() => {
  progress += 10; // Increment progress
  LoadingScreen.updateProgress(progress); // Update loading screen with progress
  if (progress >= 100) {
    clearInterval(progressInterval); // Stop the interval
    LoadingScreen.hide(); // Hide loading screen
  }
}, 500); // Update every 500ms

