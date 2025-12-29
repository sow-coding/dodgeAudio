import { getButtonFromUseElement } from "@/utils";
import { clearObjectStore, fillObjectStore } from "@/utils/database";

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "run-backup") {
        browser.runtime.sendMessage({
          type: "back-up"
        }).then((text) => {
          fillPromptTextarea(text)
        }).catch((err) => {
          console.error(err)
        })
      }
    })
    
    const dictateButton = getButtonFromUseElement('29f921');
    if (!dictateButton) return;

    let mediaChunks: Blob[] = [];

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
        .getUserMedia({ audio: true })

        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
          clearObjectStore();
          dictateButton.addEventListener("click", () => {
            // manage the delay (because of conditionnal rendering & react)
            // with MutationObserver instead
            setTimeout(() => {
              const submitDictationButton = getButtonFromUseElement('fa1dbd');
              if (!submitDictationButton) return;

              const cancelDictationButton = getButtonFromUseElement('85f94b');
              if (!cancelDictationButton) return;

              mediaRecorder.start();

              submitDictationButton.addEventListener("click", () => {
                mediaRecorder.stop();
                mediaRecorder.onstop = async () => {
                  const blob = new Blob(mediaChunks, { type: "audio/webm" });
                  fillObjectStore(blob);
                }
              });

              cancelDictationButton.addEventListener("click", () => {
                mediaRecorder.stop();
              });
            }, 1000)
          })

          mediaRecorder.ondataavailable = (e) => {
            mediaChunks.push(e.data);
          };
        })

        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  },
});
