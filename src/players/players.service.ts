import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}
    private readonly logger = new Logger(PlayersService.name);

    async getPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async getOnePlayer(_id: string): Promise<Player> {
        const playerFind = await this.playerModel.findOne({_id}).exec(); 
        if (!playerFind) {
            throw new NotFoundException(`Player with id ${_id} not found`);
        }
        return playerFind;
    }

    async deletePlayer(_id: string): Promise<any> {
        const playerFind = await this.playerModel.findOne({_id}).exec();

        if (!playerFind) {
            throw new BadRequestException(`Player with id ${_id} not found`)
        }

        return await this.playerModel.deleteOne({_id}).exec();
    }

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {

        const { email } = createPlayerDto;

        const playerFind = await this.playerModel.findOne({email}).exec();

        if (playerFind) {
            throw new BadRequestException(`Player with e-mail ${email} already have a record`)
        }

        const playerCreate = new this.playerModel(createPlayerDto);
        return await playerCreate.save();
    }

    async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {

        const playerFind = await this.playerModel.findOne({_id}).exec();

        if (!playerFind) {
            throw new BadRequestException(`Player with id ${_id} not found`)
        }

        await this.playerModel.findOneAndUpdate({_id}, {$set: updatePlayerDto}).exec();
    }

}
