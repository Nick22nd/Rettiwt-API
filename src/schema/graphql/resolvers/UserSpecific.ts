// This files contains resolvers for user specific operations

// CUSTOM LIBS
import { UserAccountService } from "../../../services/DataServices/UserAccountService";
import { config } from '../../../config/env'

// Initialsing the service to fetch user details
var userService = new UserAccountService(
    config['twitter']['auth']['authToken'],
    config['twitter']['auth']['csrfToken'],
    config['twitter']['auth']['cookie']
);

/**
 * @returns The details of the target twitter user
 * @param userName The user name of the target twitter user
 * @param id The id of the target twitter user
 */
export async function resolveUserDetails(userName?: string, id?: string): Promise<any> {
    var res: any;                                                               // To store response data
    
    // If user name is supplied
    if(userName) {
        // Getting the data
        res = await userService.getUserAccountDetails(userName);
    }
    // If id is supplied
    else if(id) {
        res = await userService.getUserAccountDetailsById(id);
    }

    // Evaluating response
    // If user is found
    if(res.success) {
        return res.data;
    }
    // If user not found or any other error
    else {
        throw new Error(res.error.message);
    }
}

/**
 * @returns The list of followers of the given twiiter user
 * @param id The id of the user whose followers are to be fetched
 * @param count The number of followers to fetch
 */
export async function resolveUserFollowers(id: string, count: number): Promise<any> {
    var followers: any[] = [];                                                  // To store the list of followers
    var next: string = '';                                                      // To store cursor to next batch
    var total: number = 0;                                                      // To store the total number of followers fetched
    var batchSize: number = 20;                                                 // To store the batchsize to use

    // If required count less than batch size, setting batch size to required count
    batchSize = (count < batchSize) ? count : batchSize;

    // Repeatedly fetching data as long as total data fetched is less than requried
    while (total < count) {
        // If this is the last batch, change batch size to number of remaining followers
        batchSize = ((count - total) < batchSize) ? (count - total) : batchSize;

        // Getting the data
        const res = await userService.getUserFollowers(id, count, next);

        // If data is available
        if (res.success) {
            // Adding fetched followers to list of followers
            followers = followers.concat(res.data.followers);

            // Updating total followers fetched
            total += res.data.followers.length;

            // Getting cursor to next batch
            next = res.data.next
        }
        // If no more data is available
        else {
            break;
        }
    }

    return followers;
}

/**
 * @returns The list of following of the given twiiter user
 * @param id The id of the user whose followings are to be fetched
 * @param count The number of following to fetch
 */
 export async function resolveUserFollowing(id: string, count: number): Promise<any> {
    var following: any[] = [];                                                  // To store the list of following
    var next: string = '';                                                      // To store cursor to next batch
    var total: number = 0;                                                      // To store the total number of following fetched
    var batchSize: number = 20;                                                 // To store the batchsize to use

    // If required count less than batch size, setting batch size to required count
    batchSize = (count < batchSize) ? count : batchSize;

    // Repeatedly fetching data as long as total data fetched is less than requried
    while (total < count) {
        // If this is the last batch, change batch size to number of remaining following
        batchSize = ((count - total) < batchSize) ? (count - total) : batchSize;

        // Getting the data
        const res = await userService.getUserFollowing(id, count, next);

        // If data is available
        if (res.success) {
            // Adding fetched following to list of following
            following = following.concat(res.data.following);

            // Updating total following fetched
            total += res.data.following.length;

            // Getting cursor to next batch
            next = res.data.next
        }
        // If no more data is available
        else {
            break;
        }
    }

    return following;
}