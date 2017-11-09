'use strict'

const Schema = use('Schema')

class PanelistsTableSchema extends Schema {

  up () {
    this.create('panelists', (table) => {
      table.increments()
      table.integer('projectid').unsigned().notNullable()
      table.string('email',254).notNullable()
      table.string('status',20)
      table.timestamps()
    })
  }

  down () {
    this.drop('panelists')
  }

}

module.exports = PanelistsTableSchema
