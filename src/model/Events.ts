import { Model, DataTypes, sequelize } from "../lib/Sequelize";

export interface Event {
  id?: number

  summary: string

  start: Date
  end: Date
  created: Date
  lastmodified: Date
}

export class EventModel extends Model<Event> {
  toJSON(): Event {
    return super.toJSON() as any
  }
}

EventModel.init({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true
  },
  summary: DataTypes.STRING,
  start: DataTypes.DATE,
  end: DataTypes.DATE,
  created: DataTypes.DATE,
  lastmodified: DataTypes.DATE
}, { sequelize, modelName: 'event', tableName: 'events' })