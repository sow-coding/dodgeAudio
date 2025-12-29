import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="backupDiv">
    <button id="backupButton">Back up</button>
    <p id="backup"></p>
  </div>
`;

document.querySelector<HTMLButtonElement>('#backupButton')?.addEventListener('click', () => {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs)
    browser.tabs.sendMessage(tabs[0].id!, { action: "run-backup" });
  });
})
