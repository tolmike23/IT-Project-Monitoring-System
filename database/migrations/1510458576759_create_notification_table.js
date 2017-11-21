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
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('notifications')
  }

}

module.exports = NotificationsTableSchema
