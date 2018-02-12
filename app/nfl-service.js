NflService = function NflService() {
    var playersData = []
    var myTeam = []

    this.loadPlayersData = function loadPlayersData(callback) {
        //Lets check the localstorage for the data before making the call.
        //Ideally if a user has already used your site 
        //we can cut down on the load time by saving and pulling from localstorage 

        var localData = localStorage.getItem('playersData');
        if (localData) {
            playersData = JSON.parse(localData);
            return callback(playersData);
            //return will short-circuit the loadPlayersData function
            //this will prevent the code below from ever executing
        }

        var url = "https://bcw-getter.herokuapp.com/?url=";
        var endpointUri = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
        var apiUrl = url + encodeURIComponent(endpointUri);

        $.getJSON(apiUrl, function (data) {
            playersData = data.body.players;
            console.log('Player Data Ready')
            console.log('Writing Player Data to localStorage')
            localStorage.setItem('playersData', JSON.stringify(playersData))
            console.log('Finished Writing Player Data to localStorage')
            callback(playersData)
        });
    }
    // loadPlayersData(callback); //call the function above every time we create a new service

    
    this.getPlayersByName = function getPlayersByName(name) {
        name = name.toLowerCase().replace(/[^a-zA-z\s]/, '')
        return playersData.filter(function (player) {
            if (
                player.fullname.toLowerCase().includes(name) ||
                // player.firstname.toLowerCase().includes(name) ||
                // player.lastname.toLowerCase().includes(name) ||
                player.pro_team.toLowerCase().includes(name) ||
                player.position.toLowerCase().includes(name)
                ) { return true }
        });
    }
    
    function checkIfPositionFilled(arr, id){
        for (let i = 0; i < arr.length; i++) {
            const player = arr[i];
            if (player.position == "QB" && id.position == "QB") {
                return true
            }
        }
        return false
    }
    
    // this.getPlayersByTeam = function (teamName) {
    //     //return an array of all players who match the given teamName.
    //     return playersData.filter(function (player) {
    //         if (player.team == teamName) {
    //             return true;
    //         }m
    //     });
    // }

    function checkPlayerId(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            const player = arr[i];
            if (player.id == id) {
                return player
            }
        }
    }

    // this.getPlayersByPosition = function (position) {
    //     //return an array of all players who match the given position.
    // }

    this.getPlayerData = function getPlayerData() {
        return playersData
    }

    this.getMyTeam = function getMyTeam() {
        return myTeam
    }

    this.removePlayer = function removePlayer(id){
        var player = checkPlayerId(myTeam, id)

        if(!player){return};

        var i = myTeam.indexOf(player)

        myTeam.splice(i, 1);
    }

    this.addToTeam = function addToTeam(id) {
        var teamMember = checkPlayerId(playersData, id)
        if (myTeam.length >= 11 ||
            checkPlayerId(myTeam, id) ||
            checkIfPositionFilled(myTeam, teamMember))
            { return }

        myTeam.push(teamMember)
    }




} 
