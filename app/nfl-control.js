NflControl = function NflControl(){
    var nflService = new NflService()
    var loading = true

    var searchElem = document.getElementById('search-element');
    var myTeamElem = document.getElementById('my-team');
    var noResultsElem = document.getElementById('no-results')

    // function ready(){
    //     loading = false; //stop the spinner
    
    //     //Now that all of our player data is back we can safely setup our bindings for the rest of the view.
        
        
    // }

    function loadPlayerData(){
        nflService.loadPlayersData(drawPlayerSearch) // will need to change this so all players do not get drawn right away.
    }

    function checkResults(arr){
        template = "";
        if(arr.length == 0){
            template += `
            
            <p> No results.</p>
            <p>Example Seach: Eli Manning, Eli, Manning, QB, or NYG</p>
            
            `
            noResultsElem.innerHTML = template
        } else{
            template = ""
            noResultsElem.innerHTML = template
        }
    }

    function drawPlayerSearch(arr){
        console.log(arr)
        checkResults(arr)
        template = "";
        for (let i = 0; i < arr.length; i++) {
            const player = arr[i];
            player.position = player.position ? player.position : 'Utility';
            template += `
            
                <li id="selected-${player.id}" onclick="app.controllers.nflCtrl.addToTeam(${player.id})" class="list-group-item search-items">${player.fullname} | ${player.position} | ${player.pro_team}</li>
            
            `       
        }
        searchElem.innerHTML = template
    }

    function drawMyTeam(arr){
        template = "";
        for (let i = 0; i < arr.length; i++) {
            const myPlayer = arr[i];
            myPlayer.position = myPlayer.position ? myPlayer.position : 'Utility';
            if(myPlayer.photo == 'http://sports.cbsimg.net/images/players/unknown-player-170x170.png'){
                myPlayer.photo = "assets/imgs/unknown-2.png"
            }

            template += `
            
            
                <div class="my-team-player">
                    <img src="${myPlayer.photo}" alt="">
                    <h4><b>Name:</b> ${myPlayer.fullname}</h4>
                    <h5><b>Position:</b> ${myPlayer.position}</h5>
                    <h5><b>Team:</b> ${myPlayer.pro_team}</h5>
                    <button class="btn btn-danger" onclick="app.controllers.nflCtrl.removePlayer(${myPlayer.id})">REMOVE</button>
                </div>
            
            
            `
            
        }
        myTeamElem.innerHTML = template
    }

    function drawSelected(id){
        var selectedElem = document.getElementById('selected' + '-' + id)
        for (let i = 0; i < nflService.getMyTeam().length; i++) {
            const myPlayer = nflService.getMyTeam()[i];
            // debugger
            if(id == myPlayer.id){
                searchElem.classList.add("highlight-green")
            }
            
        }
        // searchElem.classList.add("highlight-green")
    }


    this.addToTeam = function addToTeam(id){
        nflService.addToTeam(id);
        drawMyTeam(nflService.getMyTeam())    
        drawSelected(id)

    }

    this.search = function search(event){
        event.preventDefault();
        formData = event.target
        var name = formData.name.value
        
        loadPlayerData()
        drawPlayerSearch(nflService.getPlayersByName(name))
    }

    this.removePlayer = function removePlayer(id){
        nflService.removePlayer(id)
        drawMyTeam(nflService.getMyTeam())
    }


}