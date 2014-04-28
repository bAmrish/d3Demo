window.addEventListener('load', function(){
	makeChart1();
	makeChart2();
	makeChart3();
	//svgChart1();
});

var makeChart1 = function() {
	var data = [4, 8, 15, 16, 23, 42, 100 ];
	var scale = d3.scale.linear()
					.domain([0, d3.max(data)])
					.range([0, 420]);
 
	d3.select('div#chart1')
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
		.style('width', function(d){
			return (scale(d) + 'px');
		})
		.classed('bar', true)
		.text (function(d) {
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

var makeChart3 = function() {
	var data = [4, 8, 15, 16, 23, 42];
	d3.select('div#chart3')
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
		.text(function (d) {
			return d
		});
}