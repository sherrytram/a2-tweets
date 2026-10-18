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
		const day = t.time.getUTCDay();   // 0 = Sunday ... 6 = Saturday
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

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});