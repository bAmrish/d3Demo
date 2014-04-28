window.addEventListener('load', function(){
	console.log(d3)
	var data = [4, 8, 15, 16, 23, 42];

	d3.select("div.chart")
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
		.style('width', function(d){
			return ((d * 10) + 'px');
		}).text (function(d) {
			return d;
		});
});