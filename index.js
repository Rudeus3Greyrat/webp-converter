#!/usr/bin/env node


import * as fs from "fs";
import * as path from "path";
import {IMAGE_EXT} from "./lib/constant/index.js";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import cliProgress from 'cli-progress';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


const isFile = fileName => {
    return fs.lstatSync(fileName).isFile()
}

const isSupportedImage=fileName=>{
    return IMAGE_EXT.includes(path.extname(process.cwd()+'/'+fileName))
}

const imageList=fs.readdirSync(process.cwd()).filter(isFile).filter(isSupportedImage)

let finished=0
const convert=async (fileName) => {
    try{
        await imagemin([process.cwd()+'/'+fileName], {
            destination: process.cwd(),
            plugins: [
                imageminWebp({quality: 100,method:6,lossless:true})
            ]
        });
        finished+=1
        bar.update(finished)
        if(finished===imageList.length){
            bar.stop()
            console.log('All images have been converted to webp!')
        }
    }catch (e) {
        console.log(e)
    }
}
console.log(`Start converting ${imageList.length} images to webp...`)
bar.start(imageList.length,0)
imageList.forEach(convert)
