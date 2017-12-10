export class TcStar {

    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        _id?: string,
        createdAt?: Date | string,
        updatedAt?: Date | string) {
        this._id = _id;
        this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
        this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    }

    public static createFormJson(obj) {
        if(!obj)
            return null;
        return new TcStar(
            obj._id,
            obj.createdAt,
            obj.updatedAt
            );
    }

}
