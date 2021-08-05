import lib_PubSub from "./lib_PubSub";
import microServCB from "./microServCB";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class libraryInstance {
    private static instance: lib_PubSub = libraryInstance.setInstance();

    public static getInstance(): lib_PubSub {
        return libraryInstance.instance;
    }

    private static setInstance():lib_PubSub {
        console.log("Set new instance library")
        return new lib_PubSub(microServCB);
    }
}