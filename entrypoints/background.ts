import { DatabaseRequest } from "@/utils/database"; 
import { getTextFromSpeech } from "@/utils/fetch";

export default defineBackground(() => {
  let db: IDBDatabase;

  const DBOpenRequest = Database.open();

  DatabaseRequest.onError(DBOpenRequest, "DBOpenRequest failed.");

  DatabaseRequest.onSuccess(DBOpenRequest, () => {
    db = DBOpenRequest.result;
    console.log("DBOpenRequest succeed")
  });

  DBOpenRequest.onupgradeneeded = (event: any) => {
    db = event.target.result as IDBDatabase;
    const database = new Database(db);
    database.createObjectStore("audio", { autoIncrement: true });
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!db) return;

    const tx = db.transaction("audio", "readwrite");
    const store = tx.objectStore("audio");

    if (message.type === "back-up") {
      const req = store.get("latest");

      req.onsuccess = async () => {
        const blob = req.result?.latest;
        const { data } = await getTextFromSpeech(blob);
        sendResponse(data);
      };

      req.onerror = () => console.error("get latest failed");

      return true;
    }

    if (message.type === "objectStore-clear") {
      store.clear();
      console.log("objectStore cleared.");
    }

    if (message.type === "objectStore-fill") {
      console.log("objectStore-fill called");
      if (message.contentType === "blob") {
        store.put({ latest: message.content }, "latest");
        console.log("stored");
      }
    }
  });
});
