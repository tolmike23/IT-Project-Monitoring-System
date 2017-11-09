'use strict'

const Schema = use('Schema')

class EndorseTableSchema extends Schema {

  up () {
    this.create('endorse', (table) => {
      table.increments('groupId')
      table.integer('studentId')
      table.string('description', 254)
      table.string('endorseType', 30)
      table.string('endorseBy', 200)    
      table.string('endorseTo', 200)    
      table.boolean('confirmed')    
      table.datetime('confirmDate')
      table.string('notes', 254)
      table.timestamps()
    })
  }

  down () {
    this.drop('endorse')
  }

}

module.exports = EndorseTableSchema

