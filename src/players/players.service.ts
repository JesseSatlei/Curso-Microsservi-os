import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}
    private readonly logger = new Logger(PlayersService.name);
    
    async addUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {

        const { email } = createPlayerDto;

        const playerFind = await this.playerModel.findOne({email}).exec();

        if (playerFind) {
            await this.update(createPlayerDto);
        } else {
            await this.create(createPlayerDto);            
        }
    }

    async getPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async getOnePlayer(email: string): Promise<Player> {
        const playerFind = await this.playerModel.findOne({email}).exec(); 
        if (!playerFind) {
            throw new NotFoundException(`Player with email ${email} not found`);
        }
        return playerFind;
    }

    async deletePlayer(email: string): Promise<any> {
        return await this.playerModel.remove({email}).exec();
    }

    private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const playerCreate = new this.playerModel(createPlayerDto);
        
        return await playerCreate.save();
    }

    private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
        return await this.playerModel.findOneAndUpdate({email: createPlayerDto.email}, {$set: createPlayerDto}).exec();
    }


}
