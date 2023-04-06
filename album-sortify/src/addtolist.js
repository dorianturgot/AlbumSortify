var modal = document.getElementById("addToListModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closeAddToList")[0];

// Gets every lists from the user
function fetchListsForAlbum(userIDSpotify, alb) {
    fetch(`http://localhost:3000/albumlist/${userIDSpotify}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getListsForAlbum(data, userIDSpotify, alb);
      });
} 

    // Displays every lists from the user
function getListsForAlbum(lists, userIDSpotify, alb) {
    document.getElementById("addToListCollection").innerHTML = "";
    console.log(lists);
    const fragment = document.createDocumentFragment();
    lists.forEach((albumlist) => {
      const listCard = document.createElement("ul");

      listCard.classList.add("listCardToAdd");

      const listNameLi = document.createElement("li");
  
      const listName = document.createElement("h3");
      
      listName.textContent = albumlist.name;

      const listAddBtn = document.createElement("button");
      listAddBtn.classList.add("addToListBtn");
      listAddBtn.innerHTML = "Add to this list";

      listAddBtn.addEventListener('click', (event) => {
        console.log('YOOOOOOOO ????');
        addAlbumToThisList(albumlist.id, userIDSpotify, alb);
      });

      listNameLi.appendChild(listName);
      listNameLi.appendChild(listAddBtn);
      listCard.appendChild(listNameLi);
      fragment.appendChild(listCard);
    });
    document.getElementById("addToListCollection").appendChild(fragment);
}

// When the user clicks on the button, open the modal
export function openAddToListModal(album)
{
    const userIDSpotify = localStorage.getItem('userIDSpotify');
    console.log('add to list userID : ' + userIDSpotify);
    modal.style.display = "block";
    document.getElementById("addToListCollection").value = "";
    fetchListsForAlbum(userIDSpotify, album);
}

function addAlbumToThisList(ListID, userIDSpotify, alb)
{
      // Make POST request to add the album to the album list
      fetch("http://localhost:3000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userIDSpotify,
          name: alb.name,
          artist: alb.artists[0].name,
          picture_url: alb.images[0].url,
          url: alb.external_urls.spotify,
          releaseDate: alb.release_date,
          spotifyID: alb.id,
          listID: ListID,
        }),
      })
        .then((response) => {
          if (response.status === 500) {
            throw new Error("Server Error");
          }
          return response.json();
        })
        .then((data) => {
          console.log("New album added to list:", data);
          alert("Album added successfully to list!");
          modal.style.display = "none";
        })
        .catch((error) => {
          console.error("Error adding new album to list:", error);
          alert("Album already in list.");
        });
}
  

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}