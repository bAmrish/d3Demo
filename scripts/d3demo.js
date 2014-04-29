'use strict';

window.addEventListener('load', function(){
	makeChart1();
	makeChart2();
	makeChart3();
	svgChart1();
	svgChart2();
});

var svgChart2 = function(){
	var chartWidth = 420;
	var barHeight = 20;

	var chart = d3.select('#svg-chart2')
		.attr('width', chartWidth);

	var scale = d3.scale.linear()
		.range([0, chartWidth]);		

	var type = function(d) {
		d.value = parseInt(d.value, 10);
		return d;
	};

	d3.tsv('data.tsv', type, function(error, data) {
		console.log(data);
		
		scale.domain([0, d3.max(data, function(d) {
			return d.value;
		})]);

		chart.attr('height', barHeight * data.length);

		var bars = chart.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', function(d, i){
				return 'translate(0, ' + (barHeight * i) + ')';
			});

		bars.append('rect')
			.attr('width', function(d) {
				return scale(d.value);
			}).attr('height', barHeight - 1);

		bars.append('text')
			.attr('x', function(d) {return scale(d.value) - 3;})
			.attr('y', barHeight / 2)
			.attr('dy', '.35em')
			.text(function(d) {return d.value;});	
	});
};

var svgChart1 = function(){
	var chartWidth = 420;
	var barHeight = 20;

	var data = [4, 8, 15, 16, 23, 42, 100 ];

	var scale = d3.scale.linear()
					.domain([0, d3.max(data)])
					.range([0, chartWidth]);

	var chart = d3.select('#svg-chart1')
		.attr('width', chartWidth)
		.attr('height', barHeight * (data.length));

	var bar = chart.selectAll('g')
		.data(data)
		.enter()
		.append('g')
		.attr('transform', function(d, i){
			return 'translate(0,' + (i * barHeight) + ')';
		});

	bar.append('rect')
		.attr('width', scale)
		.attr('height', barHeight - 1);

	bar.append('text')
		.attr('x', function (d) { return scale(d) - 3; })
		.attr('y', barHeight/2)
		.attr('dy', '.35em')
		.text(function(d){return d;});
};

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
};

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
};

var makeChart3 = function() {
	var data = [4, 8, 15, 16, 23, 42];
	d3.select('div#chart3')
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
		.text(function (d) {
			return d;
		});
};