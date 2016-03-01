
var dbs = require('./csv-dist/db')

var db = dbs.db
var names = dbs.names

var ds = '08-27'
var dn = '08-31'

loopCity()

function loopCity() {
	
	console.log('')
	console.log('')
	console.log('=======================')
	console.log('date range:', ds, dn)

	for(var i = 0, len = names.length;i < len;i ++) {
		getCityAve(names[i])
	}

	console.log('=======================')
	console.log('')
	console.log('')

}

function getCityAve(city) {

	var start = false

	var ta = []
	
	var finals = []

	for(var i = 0, len0 = db.length;i < len0;i ++) {


		
		var item = db[i]

		var mmdd = item.date.slice(5)

		var rainy = item.rainy

		if(mmdd >= ds && mmdd <= dn && item.cityName === city)  {
			if(rainy !== undefined) ta.push(rainy)
			//else ta.push('false')
		}

		if(mmdd === dn) {


			if(ta.length < 3) {
				ta = []
				continue
			}

			var sum = 0
			var tl = ta.length
			var plus = [1, 2, 3, 2, 1]
			var divide = 3

			if(tl === 4) {
				plus = [1, 2, 2, 1]
				divide = 2
			}

			if(tl === 3) {
				plus = [1, 1, 1]
				divide = 1
			}

			for(var j = 0, ln = plus.length;j < ln;j ++) {

				var p = plus[j]
				sum += ta[j] * p

			}

			var ss = sum / divide
			//console.log(ta, ss)

			finals.push( ss )

			ta = []
		}


	}

	var fsum = 0
	for(var x = 0, xl = finals.length;x < xl;x ++) {
		fsum += finals[x]
	}
	var fres = fsum/xl


	console.log(city, fres, '(' + xl + ')')

}






