define(['utils'], function(u) {
	var plot = function(by_drug) {
		console.log(by_drug);
		var el = $("svg")[0];
		var height = $(el).height(), width=$(el).width();
		var months = _(_(by_drug).values()[0]).keys()
		var minmax = [
			d3.min(u.flatten(_(by_drug).values().map(function(v) { return d3.min(_(v).values()); }))),
			d3.max(u.flatten(_(by_drug).values().map(function(v) { return d3.max(_(v).values()); })))
		];
		minmax[0] = d3.min([0, minmax[0]]);
		console.log('min max ', minmax);
		console.log(' height ', height);
		var yscale = d3.scale.linear().domain(minmax).range([height,0]);
		var xscale = d3.scale.linear().domain([0,months.length]).range([0,width]);		
		months.sort();
		var color=d3.scale.linear().domain([0,_(by_drug).keys().length]).range(["black","orange"]);
		var drugs = _(by_drug).keys();
		
		_(by_drug).map(function(bytime, drugname) {
			var drug_i = drugs.indexOf(drugname);
			var vals = months.map(function(month) { return bytime[month.toString()]; });
			var linecls = 'class-'+u.hash(drugname);
			var line = d3.svg.line()
				.x(function(d,i) { return xscale(i); })
				.y(function(d,i) { return yscale(d); })
				.interpolate("basis");

			// console.log('drugname ', drugname);

			d3.select(el).selectAll('line.'+linecls).data([vals])
			 	.enter()
			 	.append('svg:path')
			 	.attr('d', line)
				.attr('color',"black")
				.attr('stroke',color(drug_i)).attr('fill','none').attr('stroke-width',1);
			
			d3.select(el).selectAll('line.'+linecls).data([vals])
				.enter()
				.append('svg:text')
			    .text(drugname)
				.attr('fill',color(drug_i))			
				.attr('x', xscale(0))
				.attr('y', yscale(vals[0]));
			
		});

		
	};

	$.get('data/results-time.txt').then(
		function(rows) {
			var by_drug = {};
			rows.split('\n').map(function(row) {
				var r = row.split('\t');
				var val = parseFloat(r[0]), drug=r[1], time=r[2];
				var drugset = by_drug[drug] || {};
				drugset[time] = val;
				by_drug[drug] = drugset;
			});
			console.log('calling plot');
			plot(by_drug);
		}
	);
});
