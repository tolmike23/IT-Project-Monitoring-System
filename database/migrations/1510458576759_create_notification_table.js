'use strict'

const Schema = use('Schema')

class NotificationsTableSchema extends Schema {

  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.integer('groupId').notNullable()
      table.string('comment').notNullable()
      table.string('category').notNullable()
      table.string('email').notNullable()
      table.boolean('statusGroup').notNullable()
      table.boolean('statusAdviser').notNullable()
        table.boolean('statusCoordinator').notNullable()
      table.boolean('statusChairman').notNullable()
      table.boolean('statusPanelist').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('notifications')
  }

}

module.exports = NotificationsTableSchema
