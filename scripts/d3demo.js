'use strict';

window.addEventListener('load', function(){
	verticalBars1();
});

var verticalBars1 = function() {
	var containerWidth = 900;
	var containerHeight = 500;
	var margin = {
		top: 20, right: 30, bottom: 30, left: 30
	};

	var chartWidth = containerWidth - margin.left - margin.right;
	var chartHeight = containerHeight - margin.top - margin.bottom;

	var y_scale = d3.scale.linear()
		.range([chartHeight, 0]);

	var x_scale = d3.scale.ordinal()
		.rangeRoundBands([0, chartWidth], 0.1);

	var x_axis = d3.svg.axis()
		.scale(x_scale)
		.orient('bottom');

	var y_axis = d3.svg.axis()
		.scale(y_scale)
		.orient('left')
		.ticks(10, '%');

	var chart = d3.select('#vbar1')
		.attr('width', containerWidth)
		.attr('height', containerHeight)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var type = function(d) {
		d.value = parseFloat(d.frequency, 10);
		return d;
	};	

	d3.tsv('alpha.tsv', type, function(error, data) {
		
		x_scale.domain(data.map(function(d) {return d.letter;}));

		y_scale.domain([0, d3.max(data, function(d) {
			return d.value;
		})]);

		chart.append('g')
			.attr('transform', 'translate(' + 0 + ', ' + chartHeight + ')')
			.attr('class', 'x axis')
			.call(x_axis);

		chart.append('g')
			.attr('class', 'y axis')
			.call(y_axis)
			.append('text')
			.text('Frequency')
			.style('text-anchor', 'end')
			.attr('transform', 'rotate(90)')
			.attr('dy', '.71em')
			.attr('y', -10)
			.attr('x', 50);

		var bars = chart.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('width', x_scale.rangeBand())
			.attr('height', 1)
			.attr('y',chartHeight)
			.attr('x', function(d) {
				return x_scale(d.letter); 
			});

			bars.transition()
				.duration(800)
				.attr('y', function(d){return y_scale(d.value); })
				.attr('height', function(d){return chartHeight - y_scale(d.value); });

	});
};
