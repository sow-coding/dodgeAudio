export class Database {
    constructor () {}

    static open(): Promise<IDBDatabase> {
        const IDBOpenRequest = indexedDB.open("audio-db", 1);
        return new Promise((resolve, reject) => {
            let db;
            IDBOpenRequest.onerror = () => {reject(IDBOpenRequest.error)}

            IDBOpenRequest.onupgradeneeded = (event: any) => {
                db = event.target.result as IDBDatabase;
                db.createObjectStore("audio", { autoIncrement: true });
            }

            IDBOpenRequest.onsuccess = () => {
                db = IDBOpenRequest.result;
                resolve(db);
            }
        })
    }
}

export async function clearObjectStore () {
    await browser.runtime.sendMessage({
        type: "objectStore-clear"
    });
}

export async function fillObjectStore (content: Blob) {
    // doesn't work on Chrome (sending Blob) because of 
    // the JSON serialization algorithm used to send messages.
    await browser.runtime.sendMessage({
        type: "objectStore-fill",
        contentType: "blob",
        content: content
    });
}