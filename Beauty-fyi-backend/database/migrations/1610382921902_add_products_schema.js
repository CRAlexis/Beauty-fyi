'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddProductsSchema extends Schema {
  up () {
    this.create('add_products', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name')
      table.integer('quantity')
      table.string('description')
      table.string('category')
      table.integer('price')
      table.integer('postage_price')
      table.string('postage_description')
      table.integer('international_postage')
      table.string('postage_shipping_time')
      table.boolean('allow_international_shipping')
      table.boolean('allow_deals')
      table.string('buy_two_deal')
      table.string('buy_three_deal')
      table.string('buy_four_deal')
      table.string('product_images')
      table.string('product_images_two')
      table.string('product_images_three')
      table.string('product_images_four')
      table.string('product_images_five')
      table.string('product_images_six')
      table.timestamps()
    })
  }

  down () {
    this.drop('add_products')
  }
}

module.exports = AddProductsSchema
