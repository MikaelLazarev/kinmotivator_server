import * as mongoose from "mongoose";

export interface IRead<T> {
    findById: (id: string) => Promise<T | null>;
    findOne: (cond?: Object) => Promise<T | null>;
    find: (cond: Object, fields: Object, options: Object) => Promise<T[]>;
}

export interface IWrite<T> {
    create: (item: T) => Promise<T | null>;
    update: (_id: mongoose.Types.ObjectId, item: T) => void;
    delete: (_id: string) => void;
}

export interface IBaseRepository<T> extends IRead<T>, IWrite<T> {

}
