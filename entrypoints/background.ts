import { getTextFromSpeech } from "@/utils/fetch";

export default defineBackground(() => {
  const dbPromise = Database.open();

  browser.runtime.onMessage.addListener(async function (message) {
    const db = await dbPromise;
    if (!db) return;

    const tx = db.transaction("audio", "readwrite");
    const store = tx.objectStore("audio");

    if (message.type === "back-up") {
      return new Promise((resolve, reject) => {
        const req = store.get("latest");

        req.onsuccess = async () => {
          const blob = req.result?.latest;
          console.log(blob)
          const { text } = await getTextFromSpeech(blob);
          resolve(text);
        };

        req.onerror = () => reject(req.error);
        })
    }

    if (message.type === "objectStore-clear") {
      store.clear();
    }

    if (message.type === "objectStore-fill") {
      if (message.contentType === "blob") {
        store.put({ latest: message.content }, "latest");
      }
    }
    return true;
  })
});