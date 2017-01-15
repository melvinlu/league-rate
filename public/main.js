function calculateStats() {
    // Clear any previous text & start calculating animation
    clearText();
    // Store the summoner names to send to the node server
    var summoners = getSummonerNames();
    // See if any summoner names were entered
    if (!checkValidity(summoners)) return;
    // Open the connection to the node server
    var socket = io();
    // Call on the node server to calculate the ranked stats of each summoner
    socket.emit('Calculate Stats', summoners);
    // Receive the ranked stats of each summoner
    socket.on('Calculated Stats', function (recentRates, seasonRates, currentStreaks) {
        displaySummoner1Stats(recentRates, seasonRates, currentStreaks);
        displaySummoner2Stats(recentRates, seasonRates, currentStreaks);
        displaySummoner3Stats(recentRates, seasonRates, currentStreaks);
        displaySummoner4Stats(recentRates, seasonRates, currentStreaks);
        displaySummoner5Stats(recentRates, seasonRates, currentStreaks);
        displayAggregateStats(recentRates, seasonRates, seasonRates);
        stopAnimations();
    });
}

function clearText() {
    document.getElementById("summoner1WR").innerHTML = "%";
    document.getElementById("summoner2WR").innerHTML = "%";
    document.getElementById("summoner3WR").innerHTML = "%";
    document.getElementById("summoner4WR").innerHTML = "%";
    document.getElementById("summoner5WR").innerHTML = "%";
    document.getElementById("summoner1SeasonWR").innerHTML = "%";
    document.getElementById("summoner2SeasonWR").innerHTML = "%";
    document.getElementById("summoner3SeasonWR").innerHTML = "%";
    document.getElementById("summoner4SeasonWR").innerHTML = "%";
    document.getElementById("summoner5SeasonWR").innerHTML = "%";
    document.getElementById("summoner1Streak").style.color = "";
    document.getElementById("summoner2Streak").style.color = "";
    document.getElementById("summoner3Streak").style.color = "";
    document.getElementById("summoner4Streak").style.color = "";
    document.getElementById("summoner5Streak").style.color = "";
    document.getElementById("summoner1Streak").innerHTML = "0";
    document.getElementById("summoner2Streak").innerHTML = "0";
    document.getElementById("summoner3Streak").innerHTML = "0";
    document.getElementById("summoner4Streak").innerHTML = "0";
    document.getElementById("summoner5Streak").innerHTML = "0";
    document.getElementById("aggregateWR").innerHTML = "";
    document.getElementById("aggregateSeasonWR").innerHTML = "";
    document.getElementById("calculateAnimation").style.display = 'block';
}

function getSummonerNames() {
    var summoners = [
        document.getElementById("summoner1").value,
        document.getElementById("summoner2").value,
        document.getElementById("summoner3").value,
        document.getElementById("summoner4").value,
        document.getElementById("summoner5").value
    ];
    // Convert each name to lowercase and remove all whitespaces
    summoners = summoners.map(summoner => summoner.toLowerCase().replace(/\s/g,''));
    return summoners;
}

function checkValidity(summoners) {
    var valid = false;
    summoners.map((summoner) => {if (summoner != "") valid = true;});
    // Do nothing if invalid query!
    if (!valid) {
        document.getElementById("calculateAnimation").style.display = 'none';
        document.getElementById("aggregateWR").innerHTML = 'No summoners entered!';
        return;
    }
    return valid;
}

function displaySummoner1Stats(recentRates, seasonRates, currentStreaks) {
    // Recent ranked win rate
    if (recentRates[0] != null) {
        document.getElementById("summoner1WR").innerHTML = recentRates[0] + '%';
    }
    // Current ranked streak
    if (currentStreaks[0]) {
        document.getElementById("summoner1Streak").innerHTML =
            currentStreaks[0] > 0 ? Math.abs(currentStreaks[0]) + 'W' :
            Math.abs(currentStreaks[0]) + 'L';
        document.getElementById("summoner1Streak").style.color =
            currentStreaks[0] > 0 ? 'green' : 'red';
    }
    // Season ranked win rate
    if (seasonRates[0] != null) {
        document.getElementById("summoner1SeasonWR").innerHTML = seasonRates[0] + '%';
    }
}

function displaySummoner2Stats(recentRates, seasonRates, currentStreaks) {
    // Recent ranked win rate
    if (recentRates[1] != null) {
        document.getElementById("summoner2WR").innerHTML = recentRates[1] + '%';
    }
    // Current ranked streak
    if (currentStreaks[1]) {
        document.getElementById("summoner2Streak").innerHTML =
            currentStreaks[1] > 0 ? Math.abs(currentStreaks[1]) + 'W' :
            Math.abs(currentStreaks[1]) + 'L';
        document.getElementById("summoner2Streak").style.color =
            currentStreaks[1] > 0 ? 'green' : 'red';
    }
    // Season ranked win rate
    if (seasonRates[1] != null) {
        document.getElementById("summoner2SeasonWR").innerHTML = seasonRates[1] + '%';
    }
}

function displaySummoner3Stats(recentRates, seasonRates, currentStreaks) {
    // Recent ranked win rate
    if (recentRates[2] != null) {
        document.getElementById("summoner3WR").innerHTML = recentRates[2] + '%';
    }
    // Current ranked streak
    if (currentStreaks[2]) {
        document.getElementById("summoner3Streak").innerHTML =
            currentStreaks[2] > 0 ? Math.abs(currentStreaks[2]) + 'W' :
            Math.abs(currentStreaks[2]) + 'L';
        document.getElementById("summoner3Streak").style.color =
            currentStreaks[2] > 0 ? 'green' : 'red';
    }
    // Season ranked win rate
    if (seasonRates[2] != null) {
        document.getElementById("summoner3SeasonWR").innerHTML = seasonRates[2] + '%';
    }
}

function displaySummoner4Stats(recentRates, seasonRates, currentStreaks) {
    // Recent ranked win rate
    if (recentRates[3] != null) {
        document.getElementById("summoner4WR").innerHTML = recentRates[3] + '%';
    }
    // Current ranked streak
    if (currentStreaks[3]) {
        document.getElementById("summoner4Streak").innerHTML =
            currentStreaks[3] > 0 ? Math.abs(currentStreaks[3]) + 'W' :
            Math.abs(currentStreaks[3]) + 'L';
        document.getElementById("summoner4Streak").style.color =
            currentStreaks[3] > 0 ? 'green' : 'red';
    }
    // Season ranked win rate
    if (seasonRates[3] != null) {
        document.getElementById("summoner4SeasonWR").innerHTML = seasonRates[3] + '%';
    }
}

function displaySummoner5Stats(recentRates, seasonRates, currentStreaks) {
    // Recent ranked win rate
    if (recentRates[4] != null) {
        document.getElementById("summoner5WR").innerHTML = recentRates[4] + '%';
    }
    // Current ranked streak
    if (currentStreaks[4]) {
        document.getElementById("summoner5Streak").innerHTML =
            currentStreaks[4] > 0 ? Math.abs(currentStreaks[4]) + 'W' :
            Math.abs(currentStreaks[4]) + 'L';
        document.getElementById("summoner5Streak").style.color =
            currentStreaks[4] > 0 ? 'green' : 'red';
    }
    // Season ranked win rate
    if (seasonRates[4] != null) {
        document.getElementById("summoner5SeasonWR").innerHTML = seasonRates[4] + '%';
    }
}

function displayAggregateStats(recentRates, seasonRates) {
    if (recentRates[5] || seasonRates[5]) {
        document.getElementById("aggregateWR").innerHTML = recentRates[5] >= 50 ?
            '<strong>Recent Aggregate:</strong> ' + recentRates[5] + '%!' :
            '<strong>Recent Aggregate:</strong> ' + recentRates[5] + '%...';
        document.getElementById("aggregateSeasonWR").innerHTML = seasonRates[5] >= 50 ?
            '<strong>Season Aggregate:</strong> ' + seasonRates[5] + '%!' :
            '<strong>Season Aggregate:</strong> ' + seasonRates[5] + '%...';
    } else {
        document.getElementById("aggregateWR").innerHTML = 'Invalid query, or wait a little!';
    }
}

function stopAnimations() {
    // Turn off calculating animation
    document.getElementById("calculateAnimation").style.display = 'none';
}
