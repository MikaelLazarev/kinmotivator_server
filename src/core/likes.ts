
import {Document} from "mongoose";
import {IBaseRepository} from "./repository";

export interface ILike extends Document {
    receiver: string;
    memo: string;
    amount: number;
    senderID: string;
    sender: string;
    feed_id: string;
    tx_id: string;
}

export interface ILikeStore extends IBaseRepository<ILike> {
    listPersonal (userID : string) : Promise<ILike[]>
}

export interface ILikeService {
    create (ic: ILike) : Promise<ILike | null>
    listPersonal (userID : string) : Promise<ILike[]>
}
