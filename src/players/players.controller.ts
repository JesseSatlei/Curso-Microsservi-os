import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { ValidationParameterPipe } from '../common/pipes/validation-parameter.pipe';
import { PlayersService } from './players.service';

@Controller('/api/v1/players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
        return await this.playersService.createPlayer(createPlayerDto);
    }

    @Put("/:_id")
    @UsePipes(ValidationPipe)
    async updatePlayer(
            @Body() updatePlayerDto: UpdatePlayerDto,
            @Param('_id', ValidationParameterPipe) _id: string
        ): Promise<void> {
        await this.playersService.updatePlayer(_id, updatePlayerDto);
    }

    @Get()
    async getPlayers(): Promise<Player[] | Player> {
        return await this.playersService.getPlayers();
    }

    @Get('/:_id')
    async getOnePlayer(
        @Param('_id', ValidationParameterPipe) _id: string ): Promise<Player> {
        return await this.playersService.getOnePlayer(_id);
    }

    @Delete('/:_id')
    async deletePlayer(
        @Param('_id', ValidationParameterPipe) _id: string): Promise<void> {
            this.playersService.deletePlayer(_id);
        }

}
