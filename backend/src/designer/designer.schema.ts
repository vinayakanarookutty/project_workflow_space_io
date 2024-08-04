/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

export type DesignDocument = Design & Document;

@Schema()
@ObjectType()
export class Design {
  @Prop()
  @Field()
  workflowId: string;

  @Prop({ required: true })
  @Field()
  workflowName!: string;

  @Prop({ required: true })
  @Field()
  description!: string;

  @Prop({ required: true })
  @Field()
  category!: string;


  @Prop({ required: true, default: Date.now  })
  @Field()
  created!: string;

  @Prop({ required: true })
  @Field()
  xmlCode!: string;

  @Prop({ required: true })
  @Field()
  processMap!: string;

  @Prop({ required: true })
  @Field(() => [String])
  formSelection!: string[];

  @Prop({ required: true })
  @Field(() => [String])
  addToProject!: string[];
}

@InputType()
export class CreateDesignInput {
  @Prop()
  @Field()
  workflowId: string;
  
  @Prop({ required: true })
  @Field()
  workflowName!: string;

  @Prop({ required: true })
  @Field()
  description!: string;

  @Prop({ required: true })
  @Field()
  category!: string;

  @Prop({ required: true })
  @Field()
  created!: string;

  @Prop({ required: true })
  @Field()
  xmlCode!: string;

  @Prop({ required: true })
  @Field()
  processMap!: string;

  @Prop({ required: true })
  @Field(() => [String])
  formSelection!: string[];

  @Prop({ required: true })
  @Field(() => [String])
  addToProject!: string[];
}

@InputType()
export class UpdateDesignXmlInput {

  
  @Field()
  xmlCode!: string;

}

export const DesignSchema = SchemaFactory.createForClass(Design);