'use strict';

window.addEventListener('load', function () {
    var config = {
        width: 1024,
        height: 500,
        margin: {
            top: 30, right: 30, bottom: 120, left: 30
        },
        tooltip: {
            show: true
        }

    };

    var b = new BarChart('#vbar1', config);

    var type = function (d) {
        d.value = parseFloat(d.CENSUS2010POP, 10);
        d.name = d.NAME;
        return d;
    };

    d3.csv('NST_EST2013_ALLDATA.csv', type, function (error, data) {

        data = data.filter(function (d) {
            return( d.STATE !== '0');
        }).sort(function (a, b) {
            return b.value - a.value;
        });

        b.update(data);

        $('#sort_order').on('change', function(){
            var val = $(this).val();
            if(val === 'value'){
                b.sort(function (a, b) {
                    return b.value - a.value;
                });
            } else {
                b.sort(function (a, b) {
                    if(a.name > b.name) return 1;
                    if(a.name < b.name) return -1;
                    return 0;
                });
            }
            //b.sort(data, val);
        });

        $('#show_line_graph').on('change', function(){
            if($(this).prop('checked')){
                $('.bar-path').attr('class', 'bar-path');
                $('.bar circle').attr('class', '');
            } else {
                $('.bar-path').attr('class', 'bar-path hidden');
                $('.bar circle').attr('class', 'hidden');
            }
        });

        $('#show_bar_graph').on('change', function(){
            if($(this).prop('checked')){
                $('.bar rect').attr('class', '');
            } else {
                $('.bar rect').attr('class', 'hidden');
            }
        })
    });
});

function BarChart(node, config) {
    var defaultConfig = {
        width: 500,
        height: 500,
        margin: {
            top: 30, right: 30, bottom: 120, left: 30
        },
        tooltip: {
            show: true,
            padding: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            },

            margin: {
                bottom: 10
            }
        }
    };

    this.config = $.extend(true, {}, defaultConfig, config);

    this.node = d3.select(node);
    this.init();
}

BarChart.prototype = {
    init: function () {

        this.containerWidth = this.config.width || 1024;
        this.containerHeight = this.config.height || 500;

        this.margin = this.config.margin || {
            top: 30, right: 30, bottom: 120, left: 30
        };

        this.chartWidth = this.containerWidth - this.margin.left - this.margin.right;
        this.chartHeight = this.containerHeight - this.margin.top - this.margin.bottom;

        this.createScales().createAxis().createChart();

        return this;
    },

    createScales: function () {
        this.y_scale = d3.scale.linear()
            .range([this.chartHeight, 0]);

        this.x_scale = d3.scale.ordinal()
            .rangeRoundBands([0, this.chartWidth], 0.1);

        return this;
    },

    createAxis: function () {
        this.x_axis = d3.svg.axis()
            .scale(this.x_scale)
            .orient('bottom');

        this.y_axis = d3.svg.axis()
            .scale(this.y_scale)
            .orient('left')
            .ticks(10, '0.0s');

        return this;
    },

    createChart: function () {
        this.chart = this.node
            .append('svg')
            .attr('class', 'chart vchart')
            .attr('width', this.containerWidth)
            .attr('height', this.containerHeight)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');

        return this;
    },

    update: function (data) {
        var barChart = this;

        this.data = data;

        this.x_scale.domain(data.map(function (d) {
            return d.name;
        }));

        this.y_scale.domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

        this.chart.append('g')
            .attr('transform', 'translate(' + 0 + ', ' + this.chartHeight + ')')
            .attr('class', 'x axis')
            .call(this.x_axis)
            .selectAll('.tick text')
            .call(function (texts) {
                texts.each(function () {
                    var text = d3.select(this)
                        .attr('style', 'text-anchor:start')
                        .attr('transform', 'rotate(90)')
                        .attr('dy', 0)
                        .attr('y', barChart.x_scale.rangeBand() * 1 / 4)
                        .attr('dx', '0.7em');
                });
            });

        this.chart.append('g')
            .attr('class', 'y axis')
            .call(this.y_axis)
            .append('text')
            .text('Population')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(90)')
            .attr('dy', '.71em')
            .attr('y', -10)
            .attr('x', 50);

        this.bars = this.chart.selectAll('g.bar')
            .data(this.data)
            .enter()
            .sort()
            .append('g')
            .attr('class', 'bar')
            .attr('transform', function (d) {
                return 'translate(' + barChart.x_scale(d.name) + ',' + 0 + ')';
            })
            .append('rect')
            .attr('width', this.x_scale.rangeBand())
            .attr('height', 1)
            .attr('y', this.chartHeight);

        this.chart.selectAll('g.bar').append('circle')
            .attr('r', 2)
            .attr('cx', (this.x_scale.rangeBand() / 2))
            .attr('cy', function(d){
                return barChart.y_scale(d.value);
            });

        var path = '';
        this.chart.selectAll('g.bar')
            .each(function(d, i){
                var x = barChart.x_scale(d.name) + (barChart.x_scale.rangeBand() / 2) ;
                var y = barChart.y_scale(d.value);
                if(i === 0){
                    path += 'M' + x + ',' + y + ' ';
                }else {
                    path += 'L' + x + ',' + (y) + ' ';
                }
            });

        this.chart.append('path')
            .attr('d', path)
            .classed({'bar-path': true});

        this.bars.transition()
            .duration(800)
            .attr('y', function (d) {
                return barChart.y_scale(d.value);
            })
            .attr('height', function (d) {
                return barChart.chartHeight - barChart.y_scale(d.value);
            });

        if (this.config.tooltip.show) {
            this.createToolTip();
        }

        return this;
    },

    createToolTip: function () {

        var barChart = this;
        var margin = this.config.tooltip.margin;
        var padding = this.config.tooltip.padding;

        /*For some reason I need to add this correction to center the text in the rectangle.*/
        var correction = 2;

        this.bars.on('mouseover', function (d, i) {
            d3.select(this.parentNode)
                .append('g')
                .attr('class', 'bar-tooltip')
                .append('text')
                .text(d.name + ' = ' + d3.format('.3s')(d.value))
                .attr('x', 0)
                .attr('y', barChart.y_scale(d.value) - (margin.bottom + padding.bottom));

            var textWidth = $(d3.select('.bar-tooltip').select('text').node()).width();
            var textHeight = $(d3.select('.bar-tooltip').select('text').node()).height();

            d3.select('.bar-tooltip')
                .insert('rect', ':first-child')
                .attr('width', textWidth + padding.left + padding.right)
                .attr('height', textHeight + padding.top + padding.bottom)
                .attr('x', ((textWidth + padding.left + padding.right) / -2))
                .attr('y', barChart.y_scale(d.value) - (textHeight + margin.bottom + padding.bottom + padding.top) + correction)
                .attr('rx', 5)
                .attr('ry', 5);

            if (i === 0) {
                d3.select('.bar-tooltip text').attr('class', 'first');
                d3.select('.bar-tooltip rect').attr('x', 0);
            }
        });

        this.bars.on('mouseout', function () {
            d3.select(this.parentNode).select('.bar-tooltip').remove();
        });
    },

    sort: function (sortFunction) {
        var barChart = this;
        var data = this.data = this.data.sort(sortFunction);
        var transitionDuration = 100;

        this.x_scale.domain(data.map(function (d) {
            return d.name;
        }));

        this.chart.select('.x.axis').remove();

        this.chart.append('g')
            .attr('transform', 'translate(' + 0 + ', ' + this.chartHeight + ')')
            .attr('class', 'x axis')
            .call(this.x_axis)
            .selectAll('.tick text')
            .call(function (texts) {
                texts.each(function () {
                    var text = d3.select(this)
                        .attr('style', 'text-anchor:start')
                        .attr('transform', 'rotate(90)')
                        .attr('dy', 0)
                        .attr('y', barChart.x_scale.rangeBand() * 1 / 4)
                        .attr('dx', '0.7em');
                });
            });

        this.chart.select('.bar-path').remove();

        var path = '';
        var pathEl = this.chart.append('path')
            .classed({'bar-path': true});

        this.chart.selectAll('g.bar')
            .sort(sortFunction)
            .transition()
            .duration(transitionDuration)
            .delay(function(d, i){
                return i * transitionDuration;
            })
            .attr('transform', function(d){
                return 'translate(' + barChart.x_scale(d.name) + ', 0)';
            })
            .style('fill', 'red')
            .each('end', function(d, i){
                var x = barChart.x_scale(d.name) + (barChart.x_scale.rangeBand() / 2) ;
                var y = barChart.y_scale(d.value);
                if(i === 0){
                    path += 'M' + x + ',' + y + ' ';
                }else {
                    path += 'L' + x + ',' + (y) + ' ';
                }
                pathEl.attr('d', path)
            });

    }
};

