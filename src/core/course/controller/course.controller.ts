import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourseService } from '../service/course.service';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModulesDto } from '../dto/moduls.dto';
import { ClassDto } from '../dto/class.dto';
import { IParamsIds } from '../interface/IParamsIds.interface';
import { Public } from 'src/core/auth/decorators/public.decorator';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('all-courses')
  findAll() {
    return this.courseService.findAll();
  }

  @Get('findOne/:id')
  findOneCourse(@Param('id') id: string) {
    return this.courseService.findOneCourse(id);
  }

  @Public()
  @Get('getCourse/:id')
  getCourse(@Param('id') id: string) {
    return this.courseService.getCourse(id);
  }

  @Get('findClass/:idCourse/:idModule/:idClass')
  findClass(@Param() objectParams: IParamsIds) {
    return this.courseService.findClass(objectParams);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() file, @Body() data) {
    return this.courseService.create(JSON.parse(data.data), file);
  }

  @Post('module/:id')
  createModule(@Param('id') id: string, @Body() data: ModulesDto) {
    return this.courseService.createModule(id, data);
  }

  @Post('class/:idCourse/:idModule')
  createClase(@Param('idCourse') course: string, @Param('idModule') module: string, @Body() data: ClassDto) {
    return this.courseService.createClass(course, module, data);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(@UploadedFile() file, @Param('id') id: string, @Body() data) {
    return this.courseService.updateCourse(file, id, JSON.parse(data.data));
  }

  @Patch('module/:idCourse/:idModule')
  updateModule(@Param('idCourse') course: string, @Param('idModule') module: string, @Body() updateCourseDto: ModulesDto) {
    return this.courseService.updateModule(course, module, updateCourseDto);
  }

  @Patch('class/:idCourse/:idModule/:idClass')
  updateClass(@Param('idCourse') course: string, @Param('idModule') module: string, @Param('idClass') idClass: string, @Body() data: ClassDto) {
    return this.courseService.updateClass(course, module, idClass, data);
  }

  @Delete('module/:idCourse/:idModule')
  deleteModule(@Param('idCourse') course: string, @Param('idModule') module: string) {
    return this.courseService.deleteModule(course, module);
  }

  @Delete('class/:idCourse/:idModule/:idClass')
  deleteClase(@Param('idCourse') course: string, @Param('idModule') module: string, @Param('idClass') idClass: string) {
    return this.courseService.deleteClass(course, module, idClass);
  }
}
