//Bar Chart with D3

document.addEventListener('DOMContentLoaded', function(){

	//Fetch data
	const request = new XMLHttpRequest();
	request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true); 
	request.send();
	request.onload = function(){

		d3.select("main")
		  .append("h1")
		  .attr("id","title")
		  .text("GDP of the United States (1947-2015)")
		  .append("div")
		  .attr("id","chart");

		// Process data
		const dataset = JSON.parse(request.responseText).data; 
		
		//convert data to date for x axis
		dataset.forEach(function (o) {
			o[2] = new Date(o[0]);
		})
		
		//Plot parameters
		const h = 600;
		const w = 1000;
		const padding = 100;
		const bar_width = (w - 2 * padding) / dataset.length;
		const color_fill="#e6e8f0";
		const color_highlight = "#3288ed";

		d3.select("#chart").style("width",w + "px");

		//Scale
		const minX = d3.min(dataset, (d) => (d[2]));
		const maxX = d3.max(dataset, (d) => (d[2]));
		const minY = d3.min(dataset, (d) => (d[1]));
		const maxY = d3.max(dataset, (d) => (d[1]));

	    const xScale = d3.scaleTime()
	    				.domain([minX, maxX])
         	 			.range([padding, w - padding]);

        const yScale = d3.scaleLinear()
	    				.domain([0, maxY])
         	 			.range([h - padding, padding]); 	

 			
        //Def Axes
		const x_axis = d3.axisBottom()
						 .scale(xScale);

		const y_axis = d3.axisLeft()
						 .scale(yScale);
						

		//Prepare plot
		const svg = d3.select("#chart")
					  .append("svg")
					  .attr("width", w)
					  .attr("height", h);

		//Plot axes
		svg.append("g")
		   .attr("id","x-axis")
		   .attr("transform","translate(0,"+ ( h - padding ) + ")")
		   .call(x_axis); 
		
		svg.append("g")
		   .attr("id","y-axis")
		   .attr("transform","translate(" + padding + ")")
		   .call(y_axis);
		
		//Add axis label
		svg.append("text")
		    .attr("text-anchor", "end")
		    .attr("x", w/2)
		    .attr("y", h - padding/2)
		    .attr("fill",color_fill)
		    .text("Year");

		svg.append("text")
		    .attr("text-anchor", "end")
		    .attr("x", - h/4)
		    .attr("y", padding/2 - 15)
		    .attr("transform","rotate(-90)")
		    .attr("fill",color_fill)
		    .text("Gross Domestic Product (in bn USD)");

        
		//Tooltip
		const tooltip = d3
			.select("#chart")
			.append("div")
			.attr("id","tooltip")
			.style("opacity","0")
			.style("position","absolute");

		//Plot bars
	    svg.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x",(d) => xScale(d[2]))
		   .attr("y",(d) => yScale(d[1]))
		   .attr("width",bar_width)
		   .attr("height",(d) => h - padding - yScale(d[1]))
		   .attr("class","bar")
		   .attr("fill",color_fill)
		   .attr("data-date", (d) => d[0])
		   .attr("data-gdp", (d) => d[1])		
		   .on("mouseover", function(event,d) {
		   		tooltip.transition().duration(100).style('opacity', 0.9);
		   		tooltip.html("GDP: " + d[1] + " bn USD<br>Date: " + d[0])
		   			   .style("left", xScale(d[2]) + "px")
		   			   .style("bottom", h - yScale(d[1]) + "px")
		   			   .attr("data-date", d[0])	
		   		d3.select(event.target).style("fill",color_highlight);
		   		console.log(event)
		  		})   
		  	.on("mouseout",function(event){
		  		tooltip.transition().duration(100).style('opacity',0);
		  		d3.select(event.target).style("fill",color_fill);
		  	})  

		//Source
		d3.select("#chart")
		  .append("div")
		  .attr("id","legend")
		  .text("More information on www.bea.gov/resources/methodologies/nipa-handbook")

	}
});