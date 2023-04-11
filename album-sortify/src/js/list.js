const userIDSpotify = localStorage.getItem('userIDSpotify');
const albumListDiv = document.querySelector("#album-list");

const queryParams = new URLSearchParams(window.location.search);
const listID = queryParams.get('listID');

console.log('userIDSpotify = ' + userIDSpotify);


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
      listCard.classList.add("text-center");
  
      const listCover = document.createElement("img");
      listCover.classList.add("albumCover");
      listCover.classList.add("card-img-top");
      listCover.src = album.picture_url;
  
      const linkPage = document.createElement("a");
      linkPage.href = "spotify.com";
      linkPage.classList.add("albumCover");

      //
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("mb-3");
      card.classList.add("albumCard");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
   
      const listName = document.createElement("h5");
      listName.classList.add("card-title");
      listName.classList.add("display-1");
      listName.textContent = album.name;

      // var separator = document.createElement("div");
      // separator.classList.add("container");
      // separator.classList.add("py-1");
      // separator.classList.add("mx-auto");
      // separator.classList.add("separator");


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

      //separator.appendChild(deleteBtn);
  
      linkPage.innerHTML = listCover.outerHTML;

      cardBody.appendChild(listName);
      
      
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
    window.location.href = "list.html?listID=" + listID;
  })
  .catch(error => {
    console.error("Error deleting album:", error);
    alert("Error deleting album.");
  });
}

// ---------- UPDATING LIST -------------

var modal = document.getElementById("newListModal");

// Get the button that opens the modal
var btn = document.getElementById("newListBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  document.getElementById("newListName").value = ""
  document.getElementById("colorPicker").value = "";
}

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
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error updating list:", error);
        alert("Error updating list.");
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