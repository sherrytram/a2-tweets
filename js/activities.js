function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//filter for completed events (only completed events will have activity types)
	const completedTweets = tweet_array.filter(t => t.source === 'completed_event');

	//tally activities
	const activityCounts = {};
	for (const tweet of completedTweets) {
		activityCounts[tweet.activityType] = (activityCounts[tweet.activityType] || 0) + 1;
	}

	//sorting array of {activityType, count}
	const activityData = Object.entries(activityCounts)
		.map(([activityType, count]) => ({ activityType: activityType, count: count }))
		.sort((a, b) => b.count - a.count);
		
	//udpate first and second sentence on activities page html span
	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;

	//longest and shortest
	const topThree = activityData.slice(0, 3).map(a => a.activityType);
	
	//only the tweets of the three most common activities
	const topTweets = completedTweets.filter(t => topThree.includes(t.activityType));

	//calcuate shortest and longet mean 
	let longestType = topThree[0];
	let shortestType = topThree[0];
	let longestMean = -Infinity;
	let shortestMean = Infinity;

	for (const type of topThree) {
		const tweetsOfType = topTweets.filter(t => t.activityType === type);
		let total = 0;
		for (const t of tweetsOfType) {
			total += t.distance;
		}
		const mean = total / tweetsOfType.length;

		if (mean > longestMean) {
			longestMean = mean;
			longestType = type;
		}
		if (mean < shortestMean) {
			shortestMean = mean;
			shortestType = type;
		}
	}

	//udpate third sentence on activities page html span
	document.getElementById('longestActivityType').innerText = longestType;
	document.getElementById('shortestActivityType').innerText = shortestType;

	//weekdays vs weekends
	let weekendSum = 0;
	let weekendCount = 0;
	let weekdaySum = 0;
	let weekdayCount = 0;

	for (const t of topTweets) {
		const day = t.time.getUTCDay();   
		if (day === 0 || day === 6) {
			weekendSum += t.distance;
			weekendCount++;
		} else {
			weekdaySum += t.distance;
			weekdayCount++;
		}
	}

	//udpate forth sentence on activities page html span
	document.getElementById('weekdayOrWeekendLonger').innerText =
		(weekendSum / weekendCount) > (weekdaySum / weekdayCount) ? 'weekends' : 'weekdays';


	//plot 1: number of tweets per activity type
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": { "field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type" },
	    "y": { "field": "count", "type": "quantitative", "title": "Number of tweets" }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//data for the distance plots: plain objects for the top three activities
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const distanceData = topTweets.map(t => ({
		activityType: t.activityType,
		day: dayNames[t.time.getUTCDay()],  
		distance: t.distance
	}));

	//plot 2: every activity, distance by day of the week
	const distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week for the three most-tweeted activities.",
	  "width": 400,
	  "data": {
	    "values": distanceData
	  },
	  "mark": { "type": "point"},
	  "encoding": {
	    "x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "Day of the week" },
	    "y": { "field": "distance", "type": "quantitative", "title": "Distance (miles)" },
	    "color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//plot 3: mean distance by day of the week
	const distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance by day of the week for the three most-tweeted activities.",
	  "width": 400,
	  "data": {
	    "values": distanceData
	  },
	  "mark": { "type": "point"},
	  "encoding": {
	    "x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "Day of the week" },
	    "y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean distance (miles)" },
	    "color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	//toggle button: alternate between the two distance plots
	const distanceDiv = document.getElementById('distanceVis');
	const aggregatedDiv = document.getElementById('distanceVisAggregated');
	const aggregateButton = document.getElementById('aggregate');

	// block keeps the chart below the button
	distanceDiv.style.display = 'block';    
	aggregatedDiv.style.display = 'none';   
	let showingMeans = false;

	aggregateButton.addEventListener('click', function () {
		showingMeans = !showingMeans;
		distanceDiv.style.display = showingMeans ? 'none' : 'block';
		aggregatedDiv.style.display = showingMeans ? 'block' : 'none';
		aggregateButton.innerText = showingMeans ? 'Show all activities' : 'Show means';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});