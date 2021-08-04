import lib_PubSub from "./lib_PubSub";
import microServCB from "./microServCB";

export default class librarySingleton {
    private static instance: lib_PubSub;

    public static getInstance(): lib_PubSub {
        if (!librarySingleton.instance) {
            librarySingleton.instance = new lib_PubSub(microServCB);
        }

        return librarySingleton.instance;
    }
}