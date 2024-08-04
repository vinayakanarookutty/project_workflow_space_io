/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DesignService } from './designer.service';
import { Design, CreateDesignInput, UpdateDesignXmlInput } from './designer.schema';

@Resolver(() => Design)
export class DesignResolver {
  constructor(private designService: DesignService) {}

  @Query(() => [Design])
  async getDesigns() {
    return this.designService.getDesigns();
  }

  
  @Mutation(() => Design)
  async updateDesignXml(
    @Args('workflowId') workflowId: string,
    @Args('input') updateDesignXmlInput: UpdateDesignXmlInput
  ) {
    return this.designService.updateDesignXml(workflowId, updateDesignXmlInput.xmlCode);
  }

  @Mutation(() => Design)
  async deleteDesignXml(
    @Args('id') id: string,
  
  ) {
    return this.designService.deleteDesign(id);
  }

  @Mutation(() => Design)
  async createDesign(@Args('input') createDesignInput: CreateDesignInput) {
    return this.designService.createDesign(createDesignInput);
  }
}