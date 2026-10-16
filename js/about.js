function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//sort all tweets by time
	const sortByTime = [...tweet_array].sort(		
		(a, b) => a.time.getTime() - b.time.getTime()
	);

	//identify earliest and latest tweet
	const earliest = sortByTime[0].time;
	const lastest = sortByTime[sortByTime.length - 1].time;

	const dateFormat = { 
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	};

	//update earliest and latest html span
	document.getElementById('firstDate').innerText =
		earliest.toLocaleDateString('en-US', dateFormat);

	document.getElementById('lastDate').innerText =
		lastest.toLocaleDateString('en-US', dateFormat);

	//count tweet categories
	const total = tweet_array.length;

	const categories = [
		{ source: 'completed_event', countClass: 'completedEvents',  pctClass: 'completedEventsPct' },
		{ source: 'live_event',      countClass: 'liveEvents',       pctClass: 'liveEventsPct' },
		{ source: 'achievement',     countClass: 'achievements',     pctClass: 'achievementsPct' },
		{ source: 'miscellaneous',   countClass: 'miscellaneous',    pctClass: 'miscellaneousPct' }
	];

	//calculate tweet categories
	for (const category of categories) {
		const count = tweet_array.filter(t => t.source === category.source).length;
		const pct = math.format(100 * count / total, { notation: 'fixed', precision: 2 }) + '%';

		//update categories html spans
		for (const span of document.getElementsByClassName(category.countClass)) {
			span.innerText = count;
		}
		for (const span of document.getElementsByClassName(category.pctClass)) {
			span.innerText = pct;
		}
	}
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});