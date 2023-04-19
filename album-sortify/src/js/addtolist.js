import { fetchLists } from "./script";

var modal = document.getElementById("addToListModal");

// Gets every lists from the user
function fetchListsForAlbum(userIDSpotify, alb) {
    fetch(`http://localhost:3000/albumlist/${userIDSpotify}` + "?sort=", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getListsForAlb(data, userIDSpotify, alb);
      });
} 

// Displays every lists from the user
export function getListsForAlb(lists, userIDSpotify, alb) {
  document.getElementById("listModal").innerHTML = "";
  lists.forEach((albumlist) => {
    const listCard = document.createElement("div");
    listCard.classList.add("card");
    listCard.classList.add("listCard");

    const listCover = document.createElement("div");
    listCover.classList.add("listCover");
    listCover.classList.add("card-img-top");
    listCover.style.backgroundColor = albumlist.color;


    const linkPage = document.createElement("a");
    linkPage.style.cursor = "pointer";
    linkPage.addEventListener("click", () => {
      console.log("there is " + alb.total_tracks);
      addAlbumToThisList(albumlist.id, userIDSpotify, alb);
    });

    const listName = document.createElement("h5");
    listName.classList.add("card-title");
    listName.classList.add("display-1");
    listName.textContent = albumlist.name;
    linkPage.innerHTML = listCover.outerHTML;

    listCard.appendChild(linkPage);
    listCard.appendChild(listName);

    document.getElementById("listModal").append(listCard);
  });
}

// When the user clicks on the button, open the modal
export async function openAddToListModal(album)
{
    const userIDSpotify = localStorage.getItem('userIDSpotify');
    fetchListsForAlbum(userIDSpotify, album);
}

export function addAlbumToThisList(ListID, userIDSpotify, alb)
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
          total_tracks: alb.total_tracks,
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
          //alert("Album added successfully to list!");
          document.getElementById("successAlert").classList.remove("d-none");
          document.getElementById("failedAlert").classList.add("d-none");
        })
        .catch((error) => {
          console.error("Error adding new album to list:", error);
          //alert("Album already in list.");
          document.getElementById("failedAlert").classList.remove("d-none");
          document.getElementById("successAlert").classList.add("d-none");
        });
}