// Define datasource URL as constant
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Create dropdown with sampleID values

function init() {
	d3.json(url).then(data => {
		var dropdown = d3.select("#selDataset")

		for (let i = 0; i < data.names.length; i++){
		dropdown.append("option").text(data.names[i]).property("value",data.names[i])
	}	
		buildCharts(data.names[0])
	})
}

function buildCharts(sampleID){
	d3.json(url).then(data => {
		const samples = data.samples

		const sample = samples.filter(element => element.id == sampleID)[0]

		console.log(sample)

	/////////// HORIZONTAL BAR CHART /////////// 

		// Define Top 10 OTU for sample, in descending order
		let trace1 = {
			x: sample.sample_values.slice(0,10).reverse(),
			y: sample.otu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse(),
			text: sample.otu_labels.slice(0,10).reverse(),
			type: 'bar',
			orientation: 'h'
		};

		// Define trace layout for horizontal bar chart
		let layout1 = {
			title: `Top 10 OTUs for ID ${sampleID}`,
			xaxis: {title: 'Sample Values'},
			yaxis: {title: 'OTU ID'}
		};

		// Plot horizontal bar chart
		Plotly.newPlot("bar", [trace1], layout1);


	/////////// BUBBLE CHART /////////// 

		// Define data elements for bubble chart
		let trace2 = {
			x: sample.otu_ids,
			y: sample.sample_values,
			text: sample.otu_labels,
			mode: 'markers',
			marker: {
				size: sample.sample_values,
				color: sample.otu_ids
					}
		};

		// Define trace layout for bubble chart
		let layout2 = {
			title: `OTU Bubble Chart for ID ${sampleID}`,
			xaxis: {title: 'OTU ID'},
			yaxis: {title: 'Sample Values'}
		};

		// Plot bubble chart
		Plotly.newPlot("bubble", [trace2], layout2);


	/////////// METADATA TABLE /////////// 

		// Extract metedata for SampleID
		let metadata = data.metadata.filter(function(meta) {
			return meta.id == parseInt(sampleID);
		})[0];
		
		console.log(metadata)
		
		// Define metadata table
		let tableContents = d3.select("#sample-metadata");

		// Overwrite previous metedata elements
		tableContents.html("");

		// Populate with 
		Object.entries(metadata).forEach(([key, value]) => {
			tableContents.append("p").text(`${key}: ${value}`);
		});


	/////////// WASH FREQUENCY CHART /////////// 
	
		// Extract wash frequency for SampleID from metadata
		let washFreq = metadata.wfreq;
		
		console.log(washFreq)

		var data1 =	[
		{
			domain: { x: [0, 1], y: [0, 1] },
			value: washFreq,
			title: { text: "Belly Button Washing Frequency Scrubs per Week" },
			type: "indicator",
			mode: "gauge+number",
			gauge:	{
				axis: { range: [0, 9] },
				tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				ticktext: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
				steps:	[
				{ range: [0, 1], color: "rgb(211, 207, 192)" },
				{ range: [1, 2], color: "rgb(210, 208, 175)" },
				{ range: [2, 3], color: "rgb(206, 209, 160)" },
				{ range: [3, 4], color: "rgb(196, 212, 146)" },
				{ range: [4, 5], color: "rgb(183, 215, 134)" },
				{ range: [5, 6], color: "rgb(164, 219, 125)" },
				{ range: [6, 7], color: "rgb(140, 222, 119)" },
				{ range: [7, 8], color: "rgb(107, 226, 117)" },
				{ range: [8, 9], color: "rgb(45, 230, 119)" }
						]
					}
		}
					];

		var layout =	{
			width: 600,
			height: 500,
			margin: { t: 0, b: 0 }
						};

		Plotly.newPlot("gauge", data1, layout);
	})
}

function optionChanged(newSample){
	buildCharts(newSample)
}

init()
