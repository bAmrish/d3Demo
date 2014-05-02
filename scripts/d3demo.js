
'use strict';

window.addEventListener('load', function(){
	chart();
});

var chart = function() {
	var containerWidth = 1024;
	var containerHeight = 500;
	var margin = {
		top: 30, right: 30, bottom: 120, left: 30
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
		.ticks(10, '0.0s');

	var chart = d3.select('#vbar1')
		.attr('width', containerWidth)
		.attr('height', containerHeight)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var type = function(d) {
		d.value = parseFloat(d.CENSUS2010POP, 10);
		d.name = d.NAME;
		return d;
	};	

	d3.csv('NST_EST2013_ALLDATA.csv', type, function(error, data) {

		data = data.filter(function(d){
			return( d.STATE !== '0');
		}).sort(function (a, b) {
			return b.value - a.value;
		});

		x_scale.domain(data.map(function(d) {return d.name;}));

		y_scale.domain([0, d3.max(data, function(d) {
			return d.value;
		})]);

		chart.append('g')
				.attr('transform', 'translate(' + 0 + ', ' + chartHeight + ')')
				.attr('class', 'x axis')
				.call(x_axis)
			.selectAll('.tick text')
				.call(function(texts){
					texts.each(function() {
						var text = d3.select(this)
							.attr('style', 'text-anchor:start')
							.attr('transform', 'rotate(90)')
							.attr('dy', 0)
							.attr('y', x_scale.rangeBand() * 1 / 4)
							.attr('dx', '0.7em');
					});
				});

		chart.append('g')
			.attr('class', 'y axis')
				.call(y_axis)
			.append('text')
				.text('Population')
				.style('text-anchor', 'end')
				.attr('transform', 'rotate(90)')
				.attr('dy', '.71em')
				.attr('y', -10)
				.attr('x', 50);

		var bars = chart.selectAll('g.bar')
				.data(data)
				.enter()
			.append('g')
				.attr('class', 'bar')
				.attr('transform', function(d){
					return 'translate(' + x_scale(d.name) + ',' + 0 + ')';	
				})
			.append('rect')
				.attr('width', x_scale.rangeBand())
				.attr('height', 1)
				.attr('y',chartHeight);

		bars.on('mouseover', function(d, i){
			var tooltip_bottom_padding = 10;
			d3.select(this.parentNode)
				.append('g')
					.attr('class', 'bar-tooltip')
				.append('text')
					.text(d.name + ' = ' + d3.format('.3s')(d.value))
					.attr('x', 0)
					.attr('y', y_scale(d.value) - tooltip_bottom_padding);

			var textWidth = $(d3.select('.bar-tooltip').select('text').node()).width();	
			var textHeight = $(d3.select('.bar-tooltip').select('text').node()).height();	

			d3.select('.bar-tooltip')
				.insert('rect', ':first-child')
					.attr('width', textWidth + 10)
					.attr('height', textHeight + 5)
 					.attr('x', (textWidth/-2) - 5)
					.attr('y', y_scale(d.value) - tooltip_bottom_padding - textHeight)
					.attr('rx', 5)
					.attr('ry', 5)
					;
			
			if(i === 0){
				d3.select('.bar-tooltip text').attr('class', 'first');
				d3.select('.bar-tooltip rect').attr('x', 0);
			}		
		});	

		bars.on('mouseout', function(){
			d3.select(this.parentNode).select('.bar-tooltip').remove();
		});

		bars.transition()
			.duration(800)
			.attr('y', function(d){return y_scale(d.value); })
			.attr('height', function(d){return chartHeight - y_scale(d.value); });

	});
};
