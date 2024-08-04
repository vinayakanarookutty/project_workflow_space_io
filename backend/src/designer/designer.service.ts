/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';

import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDesignInput, Design,DesignDocument } from './designer.schema';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class DesignService {
    constructor(@InjectModel(Design.name) private desModel: Model<DesignDocument>) {}

    async getDesigns() {
        return this.desModel.find();
      }

    async createDesign(design: CreateDesignInput){
      const checkExistingProj = await this.desModel.findOne({ 
        workflowName: design.workflowName });

      if(checkExistingProj){
        throw new Error('Project with the same Name Exists');
      }
      design.workflowId = uuidv4()
      return this.desModel.create(design);
    }


    async updateDesignXml(workflowId: string, xmlCode: string) {
      const updatedDesign = await this.desModel.findOneAndUpdate(
        { workflowId: workflowId },
        { xmlCode: xmlCode },
        { new: true }
      );
  
      if (!updatedDesign) {
        throw new Error('Design not found');
      }
  
      return updatedDesign;
    }
  
    async deleteDesign(id: string) {
      const result = await this.desModel.deleteOne({ workflowId: id });
      return result.deletedCount === 1;
    }
}