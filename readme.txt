--Readme document for Sherry Tram, smtram@uci.edu--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text search interface

2. How long, in hours, did it take you to complete this assignment?

This assignment took about 9-10 hours to complete.

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

W3Schools JavaScript tutorials (w3schools.com/js and w3schools.com/jsref) were a main resource for learning the JavaScript I used, in particular:
- String methods: startsWith, endsWith, includes, indexOf, substring, split, replace, trim, toLowerCase (the startsWith, endsWith and includes pages are linked in the assignment)
- Array methods: map, filter, sort, slice
- Dates: toLocaleDateString and getUTCDay
- Events: addEventListener and the input event
- Getters in classes

I also used Claude throughout the assignment. I asked it to:
- Explain what individual lines of code do and how they work
- Help me debug problems (for example, I edited the generated js/tweet.js by mistake and had to move my changes into ts/tweet.ts, and the page showed zeros because the TypeScript was not recompiled)
- Check candidate parsing rules against data/saved_tweets.json
I implemented, tested, and edited the suggested code myself in my own repository.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

I talked with a few classmates to compare our percentage results (for example the share of completed events and the share of tweets 
with user-written text) to check that we were getting similar numbers that fit the assignment description. We did not share code.

5. Is there anything special we need to know in order to run your code?

Nothing special is needed to run my code. Below are design decisions I made throughout the process. 

- Categories: completed = starts with "Just completed"/"Just posted"; live = starts with "Watch my" or contains "#RKLive"; 
achievement = starts with "Achieved"/"I just set a goal"; else miscellaneous. Result: 7,982 completed (96.79%), 141 live (1.71%), 
61 achievements (0.74%), 63 miscellaneous (0.76%).
- Written tweets: text after " - " once the link and #RunKeeper are removed. "TomTom MySports Watch" (a default) and empty text do not count. 
Result: 1,645 (20.61%), below the paper's ~25% but still within the +/-5% gap, because I kept the definition strict.
- Activity type: I remove the starting phrase (including the "an" versions), skip any distance, and read up to " with", " - " or " in ". 
This also names time-based activities (31 types, no "unknown" bar). "activity" is a real RunKeeper label, so I kept it. 
Distance: km converted to miles (1 mi = 1.609 km); time-based activities = 0.
- Dates and weekdays use UTC so results don't depend on time zone (the latest tweet is Sunday, September 30, 2018; it would be September 29 in Pacific time).
- about.js has no helper functions; one loop over an array handles all four categories.
- The longest/shortest and weekday/weekend spans are computed in code, not hard-coded. They match the graphs: bike longest, walk shortest, weekends longer.
- "Show means" toggles between the scatter plot and the mean plot. Both chart containers are set to display: 
block in JavaScript so the chart stays below the button (Vega-Embed makes them inline-block).
- Search is case-insensitive and only searches the written text (writtenText), because "run" and "Runkeeper" 
appear in nearly every tweet. The table updates on every input event and clears when the box is empty. Links are made clickable in getHTMLTableRow.
- No bonus feature.