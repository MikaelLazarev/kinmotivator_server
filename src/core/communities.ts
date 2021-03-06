
import {Document} from "mongoose";
import {IBaseRepository} from "./repository";

export interface ICommunity extends Document {
    title: string,
    subtitle: string,
    image: string,
    description: string
    members: object
    is_member: boolean
}

export interface ICommunityRepository extends IBaseRepository<ICommunity> {
    join(id: string, userID : string) : Promise<boolean>
    leave(id: string, userID : string) : Promise<boolean>
    listPersonal(userID: string) : Promise<ICommunity[]>
}

export interface ICommunityService {
    create(ic : ICommunity) : Promise<ICommunity | null>
    retrieve(id: string, userID: string): Promise<ICommunity | null>
    listAll() : Promise<ICommunity[]>
    listPersonal(userID: string): Promise<ICommunity[]>
    join(id: string, userID : string) : Promise<ICommunity | null>
    leave(id: string, userID : string) : Promise<ICommunity | null>
}
