function calculateRates() {
    var summoners = [
        document.getElementById("summoner1").value,
        document.getElementById("summoner2").value,
        document.getElementById("summoner3").value,
        document.getElementById("summoner4").value,
        document.getElementById("summoner5").value
    ];
    var socket = io();
    socket.emit('Calculate Rates', summoners);
    socket.on('Calculated Rates', function (rates) {
        rates.forEach(function(rate) {
            if (rate.id == 0)
                document.getElementById("summoner1WR").innerHTML = rate.WR + '%';
            if (rate.id == 1)
                document.getElementById("summoner2WR").innerHTML = rate.WR + '%';
            if (rate.id == 2)
                document.getElementById("summoner3WR").innerHTML = rate.WR + '%';
            if (rate.id == 3)
                document.getElementById("summoner4WR").innerHTML = rate.WR + '%';
            if (rate.id == 4)
                document.getElementById("summoner5WR").innerHTML = rate.WR + '%';
        });
    });
}
