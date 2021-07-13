import redis from "redis";

const client = redis.createClient();

export function checkKey(type: string, email: string) {
    return new Promise((resolve, reject) => client.get(email, (err, data: any) => {
        if (err) {
            console.error(err);
            return reject("Server error");
        }

        let value: any;
        try {
            value = JSON.parse(data);
        } catch (e) {
            return reject("Server error");
        }

        if (!value) {
            return resolve("Clear");
        }

        if ((Date.now() >= parseInt(value.lifeTime) && value.type === type)|| !value.code) {
            return resolve("Generate new");
        }

        return reject("Code already exist");
    }));
}

export function setKey(type: string, email: string, code: string) {
    return new Promise((resolve, reject) => client.set(email, JSON.stringify({
        code: code,
        lifeTime: addMinutes(2),
        type: type,
    }), "EX", 60 * 10, (err) => {
        if (err) {
            return reject(err);
        }

        return resolve("ok");
    }));
}

export function getKey(email: string) {
    return new Promise((resolve, reject) => client.get(email, (err, data) => {
        if (err) {
            return reject("Server error")
        }

        if (!data) {
            return reject("Key not exist");
        }

        resolve(data);
    }));
}

function addMinutes(minutes: number) {
    return new Date(Date.now() + minutes * 60000).getTime();
}