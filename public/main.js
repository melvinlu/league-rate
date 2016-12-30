function calculateRates() {
    // Clear any previous text & start calculating animation
    document.getElementById("summoner1WR").innerHTML = "%";
    document.getElementById("summoner2WR").innerHTML = "%";
    document.getElementById("summoner3WR").innerHTML = "%";
    document.getElementById("summoner4WR").innerHTML = "%";
    document.getElementById("summoner5WR").innerHTML = "%";
    document.getElementById("aggregateWR").innerHTML = "";
    document.getElementById("calculateAnimation").style.display = 'block';
    // Store the summoner names to send to the node server
    var summoners = [
        document.getElementById("summoner1").value,
        document.getElementById("summoner2").value,
        document.getElementById("summoner3").value,
        document.getElementById("summoner4").value,
        document.getElementById("summoner5").value
    ];
    // See if any summoner names were entered
    var valid = false;
    summoners.map((summoner) => {if (summoner != "") valid = true;});
    // Do nothing if invalid query!
    if (!valid) {
        document.getElementById("calculateAnimation").style.display = 'none';
        document.getElementById("aggregateWR").innerHTML = 'You did not enter any summoner names!';
        return;
    }
    // Convert each name to lowercase and remove all whitespaces
    summoners = summoners.map(summoner =>
        summoner.toLowerCase().replace(/\s/g,''));
    // Open the connection to the node server
    var socket = io();
    // Call on the node server to calculate the win rates of each summoner
    socket.emit('Calculate Rates', summoners);
    // Receive the win rates of each summoner as well as an aggregate rate
    socket.on('Calculated Rates', function (rates) {
        if (rates[0])
            document.getElementById("summoner1WR").innerHTML = rates[0] + '%';
        if (rates[1])
            document.getElementById("summoner2WR").innerHTML = rates[1] + '%';
        if (rates[2])
            document.getElementById("summoner3WR").innerHTML = rates[2] + '%';
        if (rates[3])
            document.getElementById("summoner4WR").innerHTML = rates[3] + '%';
        if (rates[4])
            document.getElementById("summoner5WR").innerHTML = rates[4] + '%';
        document.getElementById("aggregateWR").innerHTML = rates[5] >= 50 ?
            'Aggregate: ' + rates[5] + '%!<br/>Good luck!' :
            'Aggregate: ' + rates[5] + '%...<br/>Good luck!';
        // Turn off calculating animation
        document.getElementById("calculateAnimation").style.display = 'none';
    });
}
