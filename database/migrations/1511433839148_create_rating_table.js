'use strict'

const Schema = use('Schema')

class RatingsTableSchema extends Schema {

  up () {
    this.create('ratings', (table) => {
      table.increments()
      table.integer('projectId').notNullable()
      table.string('criteria').notNullable()
      table.integer('score').notNullable()
      table.string('createdBy').notNullable()
      table.string('comments')
      table.timestamps()
    })
  }

  down () {
    this.drop('ratings')
  }

}

module.exports = RatingsTableSchema
