const userIDSpotify = localStorage.getItem('userIDSpotify');
const albumListDiv = document.querySelector("#album-list");

const queryParams = new URLSearchParams(window.location.search);
const listID = queryParams.get('listID');

const urlParams = new URLSearchParams(window.location.search);
const MyListName = urlParams.get('listName');

console.log('userIDSpotify = ' + userIDSpotify);

var yourLists = document.getElementById('YourLists');
yourLists.innerHTML += MyListName;


fetch("http://localhost:3000/list/" + listID, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
.then(response => {
  return response.json();
})
.then(data => {
  const albumList = document.getElementById('albumList');
  //data.forEach(album => {
    // const albumDiv = document.createElement('div');
    // albumDiv.innerHTML = `<h3>${album.name} - ${album.artist}</h3>
    //                       <a href="${album.url}"><img src="${album.picture_url}" alt="${album.name}"></a>
    //                       <h4>${album.releaseDate}</h4>`;  
    // var deleteBtn = document.createElement('button');
    // deleteBtn.innerHTML = "Delete";
    // deleteBtn.classList.add("btn");
    // deleteBtn.classList.add("btn-danger");
    // deleteBtn.addEventListener("click", () => {
    //   deleteAlbum(album.id);
    // });
    // albumDiv.append(deleteBtn);
    // albumList.appendChild(albumDiv);
    data.forEach((album) => {
      const listCard = document.createElement("div");
      listCard.classList.add("card");
      listCard.classList.add("mb-3");
      listCard.classList.add("albumCard");
      listCard.classList.add("cardList");
      listCard.classList.add("text-center");
  
      const listCover = document.createElement("img");
      listCover.classList.add("albumCover");
      listCover.classList.add("albumCoverList");
      listCover.classList.add("card-img-top");
      listCover.src = album.picture_url;
  
      const linkPage = document.createElement("a");
      linkPage.href = album.url;
      linkPage.classList.add("albumCover");

      //
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("albumCard");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.classList.add("albumCardBody");
   
      const listName = document.createElement("h5");
      listName.classList.add("card-title");
      listName.classList.add("albumName");
      listName.textContent = album.name;

      const listArtist = document.createElement("p");
      listArtist.classList.add("card-text");
      listArtist.classList.add("display-1");
      listArtist.classList.add("artistName");
      listArtist.textContent = album.artist;


      const listYear = document.createElement("p");
      listYear.classList.add("card-text");
      listYear.classList.add("artistYear");

      const smallYear = document.createElement("small");
      smallYear.classList.add("text-muted");
      smallYear.textContent = album.releaseDate;

      listYear.appendChild(smallYear);


      var deleteBtn = document.createElement('button');
      deleteBtn.classList.add("btn");
      deleteBtn.classList.add("btn-danger");
      deleteBtn.classList.add("deleteBtn");
      const plus = document.createElement("i");
      plus.classList.add("fa");
      plus.classList.add("fa-minus");
      plus.style.color = "white";
      deleteBtn.appendChild(plus);

      deleteBtn.addEventListener("click", () => {
        deleteAlbum(album.id);
      });

      var listenInSpotify = document.createElement('button');
      listenInSpotify.classList.add("btn");
      listenInSpotify.classList.add("btn-success");
      listenInSpotify.classList.add("listenInSpotify");
      const spotify = document.createElement("i");
      spotify.classList.add("fab");
      spotify.classList.add("fa-spotify");
      listenInSpotify.appendChild(spotify);

  
      linkPage.innerHTML = listCover.outerHTML;

      cardBody.appendChild(listName);
      cardBody.appendChild(listArtist);
      cardBody.appendChild(listYear);
      
      
      card.appendChild(listenInSpotify);
      card.appendChild(cardBody);
      
  
      listCard.appendChild(deleteBtn);
      listCard.appendChild(linkPage);
      
      listCard.appendChild(card);
  
      albumList.append(listCard);
    });
  });

function deleteAlbum (albumID) {
  fetch("http://localhost:3000/albums/" + albumID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 500) {
      throw new Error("Server Error: " + response.statusText);
    } else {
      return response.json();
    }
  })
  .then(data => {
    console.log("Album deleted:", data);
    document.getElementById("deletedAlert").classList.remove("d-none");
    window.location.href = "list.html?listID=" + listID + "&listName=" + MyListName;
  })
  .catch(error => {
    console.error("Error deleting album:", error);
    alert("Error deleting album.");
  });
}

// ---------- UPDATING LIST -------------

var modal = document.getElementById("newListModal");

document.getElementById("newListName").value = MyListName;

var confirmBtnUpdateList = document.getElementById("confirmBtnNewList");

confirmBtnUpdateList.onclick = function() {
  const newListName = document.getElementById("newListName").value;
  const colorPicker = document.getElementById("colorPicker").value;

  if(newListName === "") {
    alert("Please enter a name for the list.");
    return;
  }

  fetch("http://localhost:3000/albumlist/" + listID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        name: newListName,
        color: colorPicker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          throw new Error("Server Error: " + response.statusText);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("List updated:", data);
        alert("List updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating list:", error);
        alert("Error updating list.");
      });
}
