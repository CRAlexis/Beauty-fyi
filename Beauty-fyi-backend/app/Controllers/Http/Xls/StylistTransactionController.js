'use strict'

const StylistTransaction = use('App/Models/StylistTransaction')
var xl = require('excel4node');

class StylistTransactionController {

  async StylistTransactionController ({ request, session, response }){
    const {userId} = request.all()

    //Get transactions
    const transactions = this.getTransactions(userId)
    const recipients = transactions.to_user_id
    const money = transactions.amount
    const amountOfTransactions = recipients.length

    //Create workbook
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Transactions');

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: '#FF0800',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    //Add data into workbook
    //Recipients
    for(var i = 0; i < amountOfTransactions; i++){
      ws.cell(1, i)
      .string(recipients[i])
      .style(style);
    }
    //Money
    for(var i = 0; i < amountOfTransactions; i++){
        ws.cell(2, i)
        .number(money[i])
        .style(style);
    }

    //Write the workbook
    wb.write('Excel.xlsx');
  }

  async getTransactions(userId){
    const stylistTransaction = await StylistTransaction.query().where('user_id', userId)
    return stylistTransaction
  }


}

module.exports = StylistTransactionController
