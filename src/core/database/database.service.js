import mongoose from 'mongoose';
import config from '../../config.js';
import GenderModel from '../../features/model/gender.model.js';
import InterestDetailModel from '../../features/model/interest-detail.model.js';
import InterestModel from '../../features/model/interest.model.js';
import RelationLookingModel from '../../features/model/relation-look.model.js';
import { GENDER_SEEDER, INTERESTS_SEEDER, RELATION_LOOKING_FOR_SEEDER } from '../../shared/utilities/seeder.js';
import { LoggerService } from '../logger/index.js';

/**
 * Database Service
 */
export default class DatabaseService {

    /**
     * Initialize the database service.
     *
     * @returns {Promise<void>}
     */
    static init = async () => {
        try {
            mongoose.set('strictQuery', false);

            await mongoose.connect(
                config.mongo.url,
                config.mongo.options
            );
            GENDER_SEEDER.map(async(item,index) =>{
                const gender = await GenderModel.findOne({name:item}).exec();
                if(!gender){
                    GenderModel.create({
                        name: item,
                    })
                }
            });
            
            RELATION_LOOKING_FOR_SEEDER.map(async(item,index) =>{
                const relation_looking = await RelationLookingModel.findOne({name:item}).exec();
                if(!relation_looking){
                    RelationLookingModel.create({
                        name: item,
                    })
                }
            });
            for (const interest of INTERESTS_SEEDER) {
                const interestExist = await InterestModel.findOne({ name: interest.title}).exec();
                let interestAddData;
                if(!interestExist){
                    interestAddData = await  InterestModel.create({
                        name: interest.title,
                    });
                }else {
                    interestAddData = interestExist
                }
                for (const item of interest.list) {
                    const interestDetailsExist = await InterestDetailModel.findOne({ interest_name: item}).exec();
                   
                    if(!interestDetailsExist){
                        InterestDetailModel.create({
                            interest_id: interestAddData._id,
                            interest_name: item,
                        })
                    }            
                }
            }
            LoggerService.logger.info('[DATABASE] Database initialized with success!');
        } catch (error) {
            LoggerService.logger.error('[DATABASE] Database failed to be initialized, aborting process!');
            LoggerService.logger.error(error);
            throw error;
        }
    };

    /**
     * Cleans up anything that "init" may setup.
     *
     * @return {Promise<void>}
     */
    static cleanup = async () => {
        await mongoose.connection.close();
    };
}
