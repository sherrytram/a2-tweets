//holds user written tweets
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//filters to user written tweets
	writtenTweets = tweet_array.filter(t => t.written);
}

function addEventHandlerForSearch() {
	const searchBox = document.getElementById('textFilter');
	const tableBody = document.getElementById('tweetTable');
	const countSpan = document.getElementById('searchCount');
	const textSpan = document.getElementById('searchText');

	countSpan.innerText = 0;
	textSpan.innerText = '';

	//'input' fires after every character is typed, deleted or pasted
	searchBox.addEventListener('input', function () {
		const searchText = searchBox.value;

		//empty search box: clear the table and the spans
		if (searchText === '') {
			tableBody.innerHTML = '';
			countSpan.innerText = 0;
			textSpan.innerText = '';
			return;
		}

		//case-insensitive search of what the person wrote
		const lowerSearch = searchText.toLowerCase();
		const matches = writtenTweets.filter(t => t.writtenText.toLowerCase().includes(lowerSearch));

		//build one table row per match, numbered from 1
		let rowsHTML = '';
		for (let i = 0; i < matches.length; i++) {
			rowsHTML += matches[i].getHTMLTableRow(i + 1);
		}
		tableBody.innerHTML = rowsHTML;

		//update the sentence above the table
		countSpan.innerText = matches.length;
		textSpan.innerText = searchText;
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});