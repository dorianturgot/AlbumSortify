var modal = document.getElementById("newListModal");

// Get the button that opens the modal
var btn = document.getElementById("newListBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

confirmBtnNewList.onclick = function() {
    const userIDSpotify = localStorage.getItem('userIDSpotify');
    const newListName = document.getElementById("newListName").value;
    const colorPicker = document.getElementById("colorPicker").value;

    fetch("http://localhost:3000/albumlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userIDSpotify,
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
          console.log("New list added:", data);
          alert("List created successfully!");
          modal.style.display = "none";
        })
        .catch((error) => {
          console.error("Error adding new list:", error);
          alert("Error creating list.");
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