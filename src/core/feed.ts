
import {Document} from "mongoose";
import {IBaseRepository} from "./repository";

export interface IFeedItem extends Document {
     id : string
     communityID: string
     title : string
     subtitle : string
     image : string
     author : string
     authorID : string
}

export interface IFeedRepository extends IBaseRepository<IFeedItem> {}

export interface IFeedService {
    create(ic: IFeedItem) : Promise<IFeedItem | null>
    retrieve(id: string) :  Promise<IFeedItem | null>
    listAll() : Promise<IFeedItem[]>
    listPersonal(userID : string) : IFeedItem[]
    join(id: string, userID : string) : boolean
    leave(id: string, userID : string) : boolean
}
