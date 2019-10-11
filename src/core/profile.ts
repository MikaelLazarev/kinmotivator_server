
import {Document} from "mongoose";
import {IBaseRepository} from "./repository";

export interface IProfile extends Document {
    name: string;
    account: string;


}

export interface IProfileRepository extends IBaseRepository<IProfile> {}

export interface IProfileService {
    create: () => Promise<IProfile | null>
    retrieve: (id: string) => Promise<IProfile | null>
    listAll: () => Promise<IProfile[]>
    listPersonal: (userID : string) => IProfile[]
    join: (id: string, userID : string) => boolean
    leave: (id: string, userID : string) => boolean
}
