export class Database {
    constructor (private db: IDBDatabase) {}

    static open(): IDBOpenDBRequest {
        return indexedDB.open("audio-db", 1);
    }

    createObjectStore (name: string, options?: any): IDBObjectStore {
        return this.db.createObjectStore(name, options);
    }
}
// extends???
export class DatabaseRequest {
    constructor() {}
    static onSuccess (databaseRequest: IDBRequest<any>, callback: (e: Event) => any) {
        databaseRequest.onsuccess = callback;
    }

    static onError(databaseRequest: IDBRequest<any>, error?: string) {
        return databaseRequest.onerror = () => {
            console.log(error);
            console.error(databaseRequest.error);
        };
    }
}

export async function clearObjectStore () {
    console.log("objectStore-clear triggered")
    await browser.runtime.sendMessage({
        type: "objectStore-clear"
    });
}

export async function fillObjectStore (content: any) {
    console.log("objectStore-fill triggered")
    await browser.runtime.sendMessage({
        type: "objectStore-fill",
        contentType: "blob",
        content
    });
}