/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesignResolver } from './designer.resolver';
import { DesignService } from './designer.service';
import { Design, DesignSchema } from './designer.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Design.name, schema: DesignSchema }])],
    providers: [DesignResolver, DesignService],
    exports: []
})
export class DesignModule {}
