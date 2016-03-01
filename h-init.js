var fs = require('fs')
var co = require('co')

var _ = require('lodash')

var toPromise = function(thunk) {
	return function() {

		//arguments to array
		var $_len = arguments.length
		var args = new Array($_len)
		for(var $_i = 0; $_i < $_len; ++$_i) {
			args[$_i] = arguments[$_i]
		}

		var ctx = this
		return new Promise(function(resolve, reject) {
			args.push(function(err, val){
				if(err) reject(err)
				else resolve(val)
			})
			thunk.apply(ctx, args)
		})
	}
}

,readFile = toPromise(fs.readFile)
,writeFile = toPromise(fs.writeFile)

var csvs = fs.readdirSync('csvs')

var names = []

function readCsvs(arr) {

	console.log(arr)

	var res = []

	for(var i = 0, len = arr.length;i < len;i ++) {

		var f = arr[i]
		var name = f.split('.')[0].split(' ')[0]
		names.push(name)

		var txt = yield readFile('csvs/' + f)

		txt = txt.toString()


		var lines = txt.split('\n')

		for(var j = 0, len0 = lines.length;j < len0;j ++) {

			var data = lines[j].split(',')

			if(data.length < 6) continue

			var y = data[0]
			var m = data[1]

			m = m.length > 1?m: '0' + m

			var d = data[2]
			d = d.length > 1?d: '0' + d

			var ymd = y + '-' + m + '-' + d

			var maxTemp = data[4]
			var minTemp = data[5]
			var rain = data[3]

			maxTemp = maxTemp === '-9999'?'无数据':parseInt(data[4], 10)
			minTemp = minTemp === '-9999'?'无数据':parseInt(data[5], 10)
			rain = rain === '-9999'?'无数据':parseInt(data[3], 10)



			var obj = {
				date: ymd
				,maxTemp: maxTemp
				,minTemp: minTemp
				,rain: rain
				,cityName: name
			}

			if(rain !== '-9999' && rain >= 100) obj.rainy = 1
			else if(rain !== '-9999' && rain < 100) obj.rainy = 0

			res.push(obj)
			//5/9×(°F－32)
		}


	}

	var str = 'exports.db = ' + JSON.stringify(res) + '\n\nexports.names = ' + JSON.stringify(names)

	var id = new Date().getTime()

	yield writeFile('csv-dist/db.js', str)

	return Promise.resolve(str)


}


co(readCsvs(csvs))
.then(function(str) {
	console.log('done')
}, function(err) {
	console.log(err.stack || err)
})

