import { IClass } from "./IClass.interface";

export interface IModule {
    _id: string;
    name: string;
    description?: string;
    classes: IClass[];
}