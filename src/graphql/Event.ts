import { Field, ObjectType, Resolver, Query, Arg, Int } from "type-graphql";
import { Event as IEvent, EventModel } from "../model/Events";

@ObjectType()
export class Event implements IEvent {
  @Field(type => Int)
  id: number;

  @Field()
  summary: string;

  @Field()
  created: Date;

  @Field()
  lastmodified: Date;

  @Field()
  start: Date;

  @Field()
  end: Date;
}

@Resolver(of => Event)
export class EventResolver {
  @Query(returns => Event, { nullable: true })
  async event(
    @Arg("id") id: number
  ): Promise<Event> {
    return (await EventModel.findOne({ where: { id } })).toJSON() as Event
  }

  @Query(returns => Int)
  async eventCount() {
    return await EventModel.count()
  }

  @Query(returns => [Event])
  async events(
    @Arg("limit", {nullable: true}) 
    limit?: number, 

    @Arg("offset", {nullable: true}) 
    offset?: number
  ): Promise<Event[]> {
    return (await EventModel.findAll({ limit, offset })).map(e => e.toJSON()) as Event[]
  }
}
