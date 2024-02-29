import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import Resize from "./fileResize.js";

/**
 * Upload profile photos.
 *
 * @return {Promise<Mail>}
 */
// const folderName = uuidv4();
// fs.mkdirSync();
export const uploadImage = async (imageData, folder_name) => {
        if (imageData) {
                const profileImage = `${uuidv4()}.${
                        imageData?.originalname?.split(".")[1]
                }`;
            
                const currentModuleUrl = import.meta.url;
                const currentModuleDir = path.dirname(new URL(currentModuleUrl).pathname);
                const imagePath = path.join(currentModuleDir, `../../uploads/${folder_name}`);
               
                const imageThumbsPath = path.join(
                  currentModuleDir,
                  `../../uploads/${folder_name}/thumb`
                );
               
                // save thumb image
                const f1 = new Resize(imageThumbsPath);
                await f1.saveThumbs(imageData.buffer, profileImage);
                // save image
                const f2 = new Resize(imagePath);
                await f2.save(imageData.buffer, profileImage);
                const fullImagePath = `${process.env.STORAGE_URL}/${folder_name}/${profileImage}`;
                
                return {
                        folder_name: `${folder_name}/${profileImage}`,
                        fullImagePath: fullImagePath,
                };
        }
};
export const uploadImagesForUser = async (user_id, imageDatas, folder_name) => {
        const userImages = [];
    
        if (imageDatas && Array.isArray(imageDatas) && imageDatas.length > 0) {
            for (const imageData of imageDatas) {
                const profileImage = `${uuidv4()}.${
                    imageData?.originalname?.split(".")[1]
                }`;
    
                const currentModuleUrl = import.meta.url;
                const currentModuleDir = path.dirname(new URL(currentModuleUrl).pathname);
                const imagePath = path.join(currentModuleDir, `../../uploads/${folder_name}`);
               
                const imageThumbsPath = path.join(
                  currentModuleDir,
                  `../../uploads/${folder_name}/thumb`
                );
               
                // save thumb image
                const f1 = new Resize(imageThumbsPath);
                await f1.saveThumbs(imageData.buffer, profileImage);
                
                // save image
                const f2 = new Resize(imagePath);
                await f2.save(imageData.buffer, profileImage);
                
                const fullImagePath = `${process.env.STORAGE_URL}/${folder_name}/${profileImage}`;
    
                userImages.push({
                    folder_name: `${folder_name}/${profileImage}`,
                    fullImagePath: fullImagePath,
                    user_id: user_id,
                });
            }
        }
    
        return userImages;
};
