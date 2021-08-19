import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('/api/v1/players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) {}

    @Post()
    async addUpdatePlayer(
        @Body() createPlayerDto: CreatePlayerDto) {
        await this.playersService.addUpdatePlayer(createPlayerDto);
    }

    @Get()
    async getPlayers(
        @Query('email') email: string ): Promise<Player[] | Player> {
        if (email) {
            return await this.playersService.getOnePlayer(email);
        } else {
            return await this.playersService.getPlayers();
        }
    }

    @Delete()
    async deletePlayer(
        @Query('email') email: string): Promise<void> {
            this.playersService.deletePlayer(email);
        }

}
