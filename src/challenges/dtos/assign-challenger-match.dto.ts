import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.interface';
import { Player } from '../../players/interfaces/player.interface'


export class AssignChallengerMatchDto {

  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  resultado: Array<Result>
  
}
