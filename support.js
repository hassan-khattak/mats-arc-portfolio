const gameButtons = [...document.querySelectorAll('[data-support-game]')];
const gameInput = document.querySelector('#supportGame');
const formStatus = document.querySelector('#supportFormStatus');
const supportForm = document.querySelector('#supportForm');

gameButtons.forEach(button => button.addEventListener('click', () => {
  gameButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  gameInput.value = button.dataset.supportGame;
  formStatus.textContent = `Selected game: ${button.dataset.supportGame}`;
  document.querySelector('#supportIssue').focus({ preventScroll:true });
}));

supportForm.addEventListener('submit', event => {
  event.preventDefault();
  const game = gameInput.value;
  const issue = document.querySelector('#supportIssue').value;
  const platform = document.querySelector('#supportPlatform').value;
  const details = document.querySelector('#supportDetails').value.trim();
  if (!details) {
    formStatus.textContent = 'Please describe the issue before preparing your email.';
    document.querySelector('#supportDetails').focus();
    return;
  }
  const subject = `MATS ARC Support — ${game} — ${issue}`;
  const body = `Game: ${game}\nPlatform: ${platform}\nIssue type: ${issue}\n\nWhat happened:\n${details}\n\nApp version (if known):\nDevice / OS version:\nStore order ID (if relevant):`;
  formStatus.textContent = 'Opening your email app…';
  location.href = `mailto:support@matsarc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
