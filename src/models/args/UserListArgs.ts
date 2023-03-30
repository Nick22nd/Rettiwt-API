// PACKAGES
import { IsInt, IsString, IsOptional, Min, validateSync, Max, ValidateIf } from 'class-validator';

// TYPES
import { ListArgs } from '../../types/Args';
import { DataValidationError } from '../errors/DataValidationError';

/**
 * The arguments for fetching cursored list in TweetService.
 * 
 * @internal
 */
export class UserListArgs implements ListArgs {
    /** The number of data items to fetch.
     * 
     * @defaultValue 40
     * @remarks Must be >= 40 and <= 100
     */
    @IsInt()
    @IsOptional()
    @Max(100)
    @ValidateIf(ob => ob.cursor.length == 0)
    @Min(40)
    count: number;

    /** The cursor to the batch of data to fetch. */
    @IsString()
    @IsOptional()
    cursor: string;

    /**
     * @param count The number of data items to fetch.
     * @param cursor The cursor to the batch of data to fetch.
     */
    constructor(count: number = 40, cursor: string = '') {
        this.count = count;
        this.cursor = cursor;

        // Validating the arguments
        const validationResult = validateSync(this);

        // If valiation error occured
        if (validationResult.length) {
            throw new DataValidationError(validationResult);
        }
    }
}