$(document).ready(function () {


	var randomScalingFactor = function () {
		return parseInt(Math.random() * 255);
	};

	var randomColor = function () {
		return 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
	}




	var times = [];
	var datasets = [];


	for(i=0;i<chartData.logTimeLabels.length; i++){
		times.push(new Date(chartData.logTimeLabels[i]).toLocaleString());
	}


	for (i = 0; i < chartData.videoUrlList.length; i++) {
		if(chartData.videoInfoList[chartData.videoUrlList[i]].likes[chartData.videoInfoList[chartData.videoUrlList[i]].likes.length - 1]){
			datasets.push({
				label: chartData.videoInfoList[chartData.videoUrlList[i]].owner,
				backgroundColor: randomColor(),
				borderColor: randomColor(),
				data: chartData.videoInfoList[chartData.videoUrlList[i]].likes,
				fill: false
			});
		}
	}

	$(".graph-wrapper").width(times.length  * 100);

	var config = {
		type: 'line',
		data: {
			labels: times,
			datasets: datasets
		},
		options: {
			responsive: true, 
			maintainAspectRatio: false,
			animation: false,
			title: {
				display: true,
				text: 'EOS Hackathon\'s Video Likes Charts'
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Time'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Likes'
					}
				}]
			},
			legend:{
				display: false
			}
		}
	};
	var ctx = $("#likesGraph")[0].getContext('2d');
	console.log(ctx);
	new Chart(ctx, config);
});