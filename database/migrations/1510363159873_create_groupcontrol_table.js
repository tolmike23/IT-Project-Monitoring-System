'use strict'

const Schema = use('Schema')

class GroupControlsTableSchema extends Schema {

  up () {
    this.create('group_controls', (table) => {
      table.increments()
      table.integer('groupId').notNullable().unique()
      table.string('groupName', 254).notNullable()
      table.string('clSched', 100).notNullable()
      table.string('groupKey', 10).notNullable().unique()
      table.string('coordinator', 254).notNullable()
      table.string('adviser', 254).notNullable()
      table.string('chairman', 254).notNullable()
      table.string('panelist', 254).notNullable()
      table.integer('joined')
      table.string('status', 20)
      table.string('notes', 254)
      table.string('rating', 10)
      table.boolean('statusCoordinator').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('group_controls')
  }

}

module.exports = GroupControlsTableSchema
