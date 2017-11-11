'use strict'

const Schema = use('Schema')

class GroupControlsTableSchema extends Schema {

  up () {
    this.create('group_controls', (table) => {
      table.increments('groupId')
      table.string('groupName', 254)
      table.string('clSched', 100).notNullable()
      table.string('groupKey', 10).notNullable().unique()
      table.string('coordinator', 254).notNullable()
      table.string('adviser', 254)
      table.string('chairman', 254)
      table.integer('joined')
      table.string('status', 20)
      table.string('notes', 254)
      table.string('rating', 10)
      table.timestamps()
    })
  }

  down () {
    this.drop('group_controls')
  }

}

module.exports = GroupControlsTableSchema
