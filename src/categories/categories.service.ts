import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService) {}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { category } = createCategoryDto;

        const categoryFind = await this.categoryModel.findOne({category}).exec();

        if (categoryFind) {
            throw new BadRequestException(`Category ${category} already have a record`);
        }

        const categoryCreate = new this.categoryModel(createCategoryDto);
        return await categoryCreate.save();
    }

    async getAllCategories(): Promise<Array<Category>> {
        // usando o pupulate será retornado todos os dados do player e não somente o Id
        return await this.categoryModel.find().populate('players').exec();
    }

    async getOneCategory(category: string): Promise<Category> {
        const categoryFind = await this.categoryModel.findOne({category}).exec();

        if (!categoryFind) {
            throw new NotFoundException(`Category ${category} not found`);
        }

        return categoryFind;
    }

    async updateCategory(category: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const categoryFind = await this.categoryModel.findOne({category}).exec();

        if (!categoryFind) {
            throw new NotFoundException(`Category ${category} not found`);
        }

        await this.categoryModel.findOneAndUpdate({category}, {updateCategoryDto}).exec();
    }

    async assignPlayerToCategory(params: string[]): Promise<void> {
        const category = params['category'];
        const idPlayer = params['idPlayer'];

        const categoryFind = await this.categoryModel.findOne({category}).exec();
        const playerFind = await this.categoryModel.find({category}).where('players').in(idPlayer).exec();

        await this.playersService.getOnePlayer(idPlayer);

        if (!categoryFind) {
            throw new BadRequestException(`Category ${category} not found`);
        }

        if (playerFind.length > 0) {
            throw new BadRequestException(`Player ${category} already have a record in category`);
        }

        categoryFind.players.push(idPlayer);
        await this.categoryModel.findOneAndUpdate({category}, {$set: categoryFind}).exec();

    }
}
