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

	const sortByTime = [...tweet_array].sort(		
		(a, b) => a.time.getTime() - b.time.getTime()
	);

	const earliest = sortByTime[0].time;
	const lastest = sortByTime[sortByTime.length - 1].time;

	const dateFormat = { 
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	document.getElementById('firstDate').innerText =
		earliest.toLocaleDateString('en-US', dateFormat);

	document.getElementById('lastDate').innerText =
		lastest.toLocaleDateString('en-US', dateFormat);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});