import { Controller, Get, UseFilters } from "@nestjs/common";
import { CitiesService } from "../service/cities.service";
import { HttpExceptionFilter } from "src/http-exception/http-exception.filter";

@UseFilters(HttpExceptionFilter)
@Controller('cities')
export class CitiesController {

    constructor(private readonly citiesService: CitiesService) {}
    @Get("allCities")
    getAllCities(){
        return this.citiesService.getAllCities();
    }
}