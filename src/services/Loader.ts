import axios from "axios";
import ical, { CalendarComponent } from "ical";
import { calendarUrl, reloadTimeout } from "../config";
import { BaseService } from "../lib/Service";
import { EventModel } from "../model/Events";

/** @description Сервис загрузки данных */
export class LoaderService implements BaseService {
  /** @description Статус работы */
  work = false

  /** @description Последняя загрузка */
  lastLoad = new Date()

  /** @description Таймер следующего запроса */
  timer = setTimeout(() => { }, 0)

  /** @description Функция таймера следующего запроса */
  timerResolve = () => { }

  /** @description Запуск сервиса */
  async start() {
    if (this.work) return
    this.work = true
    this.loop()
      .catch(e => {
        this.work = false
        console.error(e)
      })
  }

  /** @description Остановка сервиса */
  async stop() {
    if (!this.work) return
    this.work = false

    clearTimeout(this.timer)
    this.timerResolve()

    delete this.timer
    delete this.timerResolve
  }

  /** @description Сохранение данных */
  async save(items: CalendarComponent[]) {
    // Поиск существующих записей по id
    const haveItems = await Promise.all(items.map(item => 
      EventModel.findOne({where: {id: +item.uid}})))

    return Promise.all(
      items.map(
        async item => {
          const object = haveItems.find(e => 
            e && e.getDataValue('id') == +item.uid)

          if(object) {
            let modify = false

            if(object.getDataValue('summary') != item.summary)
              object.set('summary', item.summary) && (modify = true)

            if(+object.getDataValue('start') != +item.start)
              object.set('start', item.start) && (modify = true)

            if(+object.getDataValue('end') != +item.end)
              object.set('end', item.end) && (modify = true)

            if(+object.getDataValue('created') != +item.created)
              object.set('created', item.created) && (modify = true)

            if(+object.getDataValue('lastmodified') != +item.lastmodified)
              object.set('lastmodified', item.lastmodified) && (modify = true)
          
            if(!modify)
              return object

            return object.save().then((e) => {
              console.log(`Updated: ${item.uid}`)
              return e
            })
          }

          return EventModel.create({
            id: +item.uid,
            start: item.start,
            end: item.end,
            created: item.created,
            lastmodified: item.lastmodified,
            summary: item.summary
          }).then((e) => {
            console.log(`Loaded: ${item.uid}`)
            return e
          })
        }
      )
    )
  }

  /** @description Получение данных */
  async load() {
    try {
      const { data } = await axios.get<string>(calendarUrl)
      return Object.values(ical.parseICS(data))
    } catch (error) {
      console.error('Ошибка загрузки', error)
      return []
    } finally {
      this.lastLoad = new Date()
    }
  }

  /** @description Задержка перед следующим запуском */
  getDelay() {
    const delta = Date.now() - +this.lastLoad
    const outDelay = reloadTimeout - delta
    return outDelay <= 0 ? 0 : outDelay
  }

  /** @description Единичная итерация сервиса */
  async loop() {
    if (!this.work) return
    const loadedObjects = await this.load()

    await this.save(loadedObjects)

    if (!this.work) return

    if (!this.work) return
    await new Promise((resolve) => {
      this.timer = setTimeout(() => {
        resolve(null)
      }, this.getDelay())
    })

    if (!this.work) return
    await this.loop()
  }
}