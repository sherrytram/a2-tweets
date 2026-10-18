class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //completed_event: 'Just completed' or 'Just posted'
        if (this.text.startsWith('Just completed') || this.text.startsWith('Just posted')) {
            return 'completed_event';
        }

        //live_event: 'Watch my' or '#RKLive'
        if (this.text.startsWith('Watch my') || this.text.includes('#RKLive')) {
            return 'live_event';
        }

        //achievement: 'Achieved' or 'I just set a goal'
        if (this.text.startsWith('Achieved') || this.text.startsWith('I just set a goal')) {
            return 'achievement';
        }

        //miscellaneous: everything else
        return 'miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText !== "";
    }

    get writtenText():string {
        //user written tweets can only be 'completed_events'
        if (this.source != 'completed_event') {
            return "";
        }

        //user writen text comes after " - ", default tweets dont contain
        const dashIndex = this.text.indexOf(' - ');
        if (dashIndex === -1) {
            return "";
        }

        //parse the written text from the tweet
        let userText = this.text.substring(dashIndex + 3);
        userText = userText.replace(/https?:\/\/\S+/g, '');
        userText = userText.replace(/#RunKeeper/gi, '');
        userText = userText.trim();

        //ignore tomtom watch default text
        if (userText === 'TomTom MySports Watch') {
        return "";
        }

        return userText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        // remove beginning part of tweet
        let rest = this.text;
        const prefixes = ['Just completed an ', 'Just completed a ', 'Just posted an ', 'Just posted a '];
        for (const prefix of prefixes) {
            if (rest.startsWith(prefix)) {
                rest = rest.substring(prefix.length);
                break;
            }
        }

        // if a distance comes first, skip the number and unit
        const words = rest.split(' ');
        if (words[1] === 'km' || words[1] === 'mi') {
            rest = words.slice(2).join(' ');
        }

        //activity ends at " with", " - " or " in "
        let endIndex = rest.length;
        for (const marker of [' with', ' - ', ' in ']) {
            const index = rest.indexOf(marker);
            if (index !== -1 && index < endIndex) {
                endIndex = index;
            }
        }

        return rest.substring(0, endIndex); 
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        // find unit
        const words = this.text.split(' ');
        const value = parseFloat(words[3]);

        // if unit is km, convert, otherwise return distance
        if (words[4] === 'km') {
            return value / 1.609;   
        }
        if (words[4] === 'mi') {
            return value;
        }

        // time-based activities have no distance
        return 0;   
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}