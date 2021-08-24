import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
            return await this.categoriesService.createCategory(createCategoryDto)
        }

    @Get()
    async getCategories(): Promise<Array<Category>> {
        return await this.categoriesService.getAllCategories();
    }

    @Get('/:category')
    async getOneCategory(
        @Param('category') category: string): Promise<Category> {
            return await this.categoriesService.getOneCategory(category);
        }

    @Put('/:category')
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Body() updateCategory: UpdateCategoryDto,
        @Param('category') category: string): Promise<void> {
            await this.categoriesService.updateCategory(category, updateCategory);
        }

    @Post('/:category/players/:idPlayer') 
    async assignPlayerToCategory(
        @Param() params: string[]): Promise<void> {
            return await this.categoriesService.assignPlayerToCategory(params);
    }
}
