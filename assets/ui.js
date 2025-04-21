window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const muteBtn = document.getElementById('mute-btn');

  // Update button icon
  const updateIcon = () => {
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  };

  muteBtn.addEventListener('click', () => {
    if (audio.muted) {
      // User is unmuting — force play
      audio.muted = false;
      audio.play().catch(err => console.warn('Autoplay failed:', err));
    } else {
      // User is muting
      audio.muted = true;
    }
    updateIcon();
  });

  updateIcon();
});
