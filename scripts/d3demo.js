window.addEventListener('load', function(){
	makeChart1();
	makeChart2();
});

var makeChart1 = function() {
	var data = [4, 8, 15, 16, 23, 42];

	d3.select('div#chart1')
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
		.style('width', function(d){
			return ((d * 10) + 'px');
		}).text (function(d) {
			return d;
		});
}

var makeChart2 = function() {
	var data = [4, 8, 15, 16, 23, 42];
	var chart = d3.select('div#chart2');
	var bars = chart.selectAll('div');
	var barsUpdate = bars.data(data);
	var barEnter = barsUpdate.enter().append('div');
	barEnter.style('width', function(value){
		return ((value * 10) + 'px');
	});
	barEnter.text(function (value) {
		return value;
	});
}