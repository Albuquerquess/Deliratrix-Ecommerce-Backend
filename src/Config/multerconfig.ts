import aws from 'aws-sdk';
import dotenv from 'dotenv';
import { Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import RandomTxid from '../Utils/txidGenerator';
dotenv.config()

const storageTypes = {
    local: multer.diskStorage({
        destination: (_, file, cb) => {
            cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
        },    
        filename: (request: Request, file, cb) => {
            file.key = `${RandomTxid()}-${file.originalname}`;
            cb(null, file.key)
        },    
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (request: Request, file, cb) => {
            const fileName = `${RandomTxid()}-${file.originalname}`;
            cb(null, fileName)
        }
    })
}

export default {
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE === 's3' ? 's3':'local']  
} 