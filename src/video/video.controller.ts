import { Controller, UseFilters, Get, Post } from '@nestjs/common';

// layers
import { VideoService } from './video.service';
import { HttpExceptionFilter } from 'src/middlewares/exception.filter';


@Controller('video')
@UseFilters(HttpExceptionFilter)
export class VideoController {
    
    constructor(private readonly videoService: VideoService) { }

    @Post('/pre-signed-url')
    async postPreSignedUrl() {
        const preSignedUrl = await this.videoService.postPreSignedUrl();
        return { isSuccess:true, preSignedUrl }
    }
    
    @Get('/get-image')
    async getImage() {
        return await this.videoService.getImage();
    }

}
