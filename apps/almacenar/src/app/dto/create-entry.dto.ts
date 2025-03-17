import { IsNotEmpty, IsString, Matches } from 'class-validator';


export class CreateSpeciesInputDto {
    
    @IsString()
    @IsNotEmpty()
    description: string

    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Deadline debe estar en YYYY-MM-DD format' })
    @IsNotEmpty()
    deadline: string
    
}