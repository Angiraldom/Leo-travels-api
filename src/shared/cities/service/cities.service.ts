import { Injectable } from "@nestjs/common";
import { City } from "../schema/cities.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { buildResponseSuccess } from "src/shared/utils/utilities/Response.util";

@Injectable()
export class CitiesService {

    constructor(@InjectModel("Cities") private readonly citieModel: Model<City>) {}

    async getAllCities() {

        const cities = await this.citieModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: "$nombreDepartamento",
                    municipalities: { $push: "$$ROOT" }
                }
            }
        ]).sort({ _id: 1 });

        return buildResponseSuccess({
            data : cities
        });
    }
}