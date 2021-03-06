'use strict'

const Schema = use('Schema')

class WorkbreakdownsTableSchema extends Schema {

  up () {
    this.create('workbreakdowns', (table) => {
      table.increments('workId').notNullable()
      table.integer('must_id').notNullable()
      table.integer('groupId').notNullable()
      table.string('description').notNullable()
      table.string('email').notNullable()
      table.string('status').notNullable()
      table.string('startdate').notNullable()
      table.string('enddate').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('workbreakdowns')
  }

}

module.exports = WorkbreakdownsTableSchema
