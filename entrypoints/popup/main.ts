import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="backupButton">Back up</button>
  </div>
`;

document.querySelector<HTMLButtonElement>('#backupButton')?.addEventListener('click', () => {
  browser.runtime.sendMessage({
    type: "back-up"
  }).then((message) => {
    console.log("Voici le texte: " + message);
  }).catch((err) => {
    console.error(err)
  })
})
