import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { UpdateChallengerDto } from './dtos/update-challenger.dto';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Challenge, Match } from './interfaces/challenge.interface';
import { AssignChallengerMatchDto } from './dtos/assign-challenger-match.dto';
import { ChallengeStatus } from './interfaces/challenge.status.enum';

@Injectable()
export class ChallengesService {

    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService) {}

        private readonly logger = new Logger(ChallengesService.name)

    async createChallenge(createChallengerDto: CreateChallengerDto): Promise<Challenge> {

        const players = await this.playersService.getPlayers();

        createChallengerDto.players.map(playerDto => {
            const playerFilter = players.filter( player => player._id == playerDto._id )

            if (playerFilter.length == 0) {
                throw new BadRequestException(`${playerDto._id} is not a player!`)
            }
        
        })

        const requesterPlayerMatch = await createChallengerDto.players.filter(player => player._id == createChallengerDto.requester)

        this.logger.log(`requesterPlayerMatch: ${requesterPlayerMatch}`)

        if(requesterPlayerMatch.length == 0) {
            throw new BadRequestException(`The requester is not a player of match!`)
        }

        const categoryPlayer = await this.categoriesService.consultCategoryForPlayer(createChallengerDto.requester)

        if (!categoryPlayer) {
            throw new BadRequestException(`The requester need register in category!`)
        }

        const desafioCriado = new this.challengeModel(createChallengerDto)
        desafioCriado.category = categoryPlayer.category
        desafioCriado.dateTimeRequest = new Date()
        desafioCriado.status = ChallengeStatus.PENDENTE
        this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`)
        return await desafioCriado.save()

    }

    async getAllChallenges(): Promise<Array<Challenge>> {
        return await this.challengeModel.find()
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec()
    }

    async getChallengesOnePlayer(_id: any): Promise<Array<Challenge>> {

       const players = await this.playersService.getPlayers()

        const playerFilter = players.filter( player => player._id == _id )

        if (playerFilter.length == 0) {
            throw new BadRequestException(`The id ${_id} is not a player!`)
        }

        return await this.challengeModel.find()
        .where('players')
        .in(_id)
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec()

    }

    async updateChallenge(_id: string, updateChallengerDto: UpdateChallengerDto): Promise<void> {
   
        const challengeFind = await this.challengeModel.findById(_id).exec()

        if (!challengeFind) {
            throw new NotFoundException(`Challenge ${_id} is not create!`)
        }

        if (updateChallengerDto.status){
           challengeFind.dateTimeResponse = new Date()         
        }
        challengeFind.status = updateChallengerDto.status
        challengeFind.dateTimeChallenge = updateChallengerDto.dateTimeChallenge

        await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFind}).exec()
        
    }

    async assignChallengeMatch(_id: string, assignChallengerMatchDto: AssignChallengerMatchDto ): Promise<void> {

        const challengeFind = await this.challengeModel.findById(_id).exec()
        
        if (!challengeFind) {
            throw new BadRequestException(`Challenge ${_id} is not create!`)
        }

        const playerFilter = challengeFind.players.filter( player => player._id == assignChallengerMatchDto.def )

        this.logger.log(`challengeFind: ${challengeFind}`)
        this.logger.log(`playerFilter: ${playerFilter}`)

        if (playerFilter.length == 0) {
            throw new BadRequestException(`The player win is not party for challenge!`)
        }

        const matchCreate = new this.matchModel(assignChallengerMatchDto)

        matchCreate.category = challengeFind.category

        matchCreate.players = challengeFind.players

        const resultado = await matchCreate.save()

        challengeFind.status = ChallengeStatus.REALIZADO
        challengeFind.match = resultado._id

        try {
            await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFind}).exec() 
        } catch (error) {
           await this.matchModel.deleteOne({_id: resultado._id}).exec();
           throw new InternalServerErrorException()
        }
    }

    async deleteChallenge(_id: string): Promise<void> {

        const challengeFind = await this.challengeModel.findById(_id).exec()

        if (!challengeFind) {
            throw new BadRequestException(`Challenge ${_id} is not create!`)
        }

       challengeFind.status = ChallengeStatus.CANCELADO

       await this.challengeModel.findOneAndUpdate({_id},{$set: challengeFind}).exec() 

    }

}
