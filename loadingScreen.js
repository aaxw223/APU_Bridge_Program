// loadingScreen.js with special effects

const LoadingScreen = (() => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  const loadingText = document.getElementById('loading-text');

  // Show loading screen with fade-in effect
  const show = () => {
      if (loadingScreen) {
          loadingScreen.style.opacity = 0;
          loadingScreen.style.display = 'flex';
          setTimeout(() => {
              loadingScreen.style.transition = 'opacity 0.5s ease-in-out';
              loadingScreen.style.opacity = 1;
          }, 10);
      }
      if (mainContent) {
          mainContent.style.transition = 'opacity 0.5s ease-in-out';
          mainContent.style.opacity = 0;
          setTimeout(() => {
              mainContent.style.display = 'none';
          }, 500);
      }
  };

  // Update loading progress with animation
  const updateProgress = (progress) => {
      if (loadingText) {
          loadingText.textContent = `Loading... ${progress}%`;
          loadingText.style.animation = 'fadeInOut 1s ease-in-out infinite';
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
const loadingPercent = document.getElementById('loading-percent');

const updateProgress = (progress) => {
    if (loadingText) {
        loadingText.textContent = `Loading... ${progress}%`;
        loadingText.style.animation = 'fadeInOut 1s ease-in-out infinite';
    }
    if (loadingPercent) {
        loadingPercent.textContent = `${progress}%`;
    }
};
let progress = 0;
LoadingScreen.show();
const progressInterval = setInterval(() => {
    progress += 10; // Increment progress
    LoadingScreen.updateProgress(progress);
    if (progress >= 100) {
        clearInterval(progressInterval);
        LoadingScreen.hide();
    }
}, 500); // Update every 500ms

// Add a fadeInOut keyframe animation to the CSS dynamically
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

// Wait for the window to fully load
window.addEventListener('load', () => {
  LoadingScreen.hide();
});

