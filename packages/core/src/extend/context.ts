export interface Context {
    raw: any;
    json: any;
    readonly data?: any;
    readonly rawData: any;
}

export default {
    set json(data: any) {
        this.response.type = 'json';
        this.raw = JSON.stringify(data);
        this.status = 200;
    },

    get data() {
        return this.request.body;
    },

    get rawData() {
        return this.request.rawData;
    },
} as Context;
