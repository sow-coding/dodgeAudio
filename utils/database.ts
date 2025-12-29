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
    console.log("objectStore-clear triggered")
    await browser.runtime.sendMessage({
        type: "objectStore-clear"
    });
}

export async function fillObjectStore (content: Blob) {
    await browser.runtime.sendMessage({
        type: "objectStore-fill",
        contentType: "blob",
        content: content
    });
}