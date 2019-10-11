
import {Document} from "mongoose";
import {IBaseRepository} from "./repository";

export interface IAchievement extends Document {
    name: string;
    account: string;


}

export interface IAchievementRepository extends IBaseRepository<IAchievement> {}

export interface IAchievementService {
    create: () => Promise<IAchievement | null>
    retrieve: (id: string) => Promise<IAchievement | null>
    listAll: () => Promise<IAchievement[]>
    listPersonal: (userID : string) => IAchievement[]
    join: (id: string, userID : string) => boolean
    leave: (id: string, userID : string) => boolean
}
