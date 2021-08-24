import { Body, Controller, Delete, Get, Logger, Post, Put, UsePipes, ValidationPipe, Query, Param } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengerMatchDto } from './dtos/assign-challenger-match.dto';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { UpdateChallengerDto } from './dtos/update-challenger.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
    constructor (private readonly challengesService: ChallengesService){}

    private readonly logger = new Logger(ChallengesController.name);

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengerDto: CreateChallengerDto): Promise<Challenge> {
        this.logger.log(`createChallengerDto: ${JSON.stringify(createChallengerDto)}`)
        return await this.challengesService.createChallenge(createChallengerDto);
    }

    @Get()
    async getChallenges(
        @Query('idPlayer') _id: string): Promise<Array<Challenge>> {
            return _id ? await this.challengesService.getChallengesOnePlayer(_id) : await this.challengesService.getAllChallenges()
    }

    @Put('/:challenger')
    async updateChallenge(
        @Body(ChallengeStatusValidationPipe) updateChallengerDto: UpdateChallengerDto,
        @Param('desafio') _id: string): Promise<void> {
            await this.challengesService.updateChallenge(_id, updateChallengerDto);
    }

    @Post('/:challenger/match')
    async assignChallengeMatch(
        @Body(ValidationPipe) assignChallengerMatchDto: AssignChallengerMatchDto,
        @Param('challenger') _id: string): Promise<void> {
            return await this.challengesService.assignChallengeMatch(_id, assignChallengerMatchDto);
    }

    @Delete('/:_id')
    async deleteChallenger(
        @Param('_id') _id: string): Promise<void> {
            await this.challengesService.deleteChallenge(_id)

    }
}
