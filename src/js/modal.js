import { fetchLists } from "./script.js";

// Get the button that opens the modal
var confirmBtnNewList = document.getElementById("confirmBtnNewList");


confirmBtnNewList.onclick = function() {
    const userIDSpotify = localStorage.getItem('userIDSpotify');
    const newListName = document.getElementById("newListName").value;
    const colorPicker = document.getElementById("colorPicker").value;

    if(newListName === "") {
      alert("Please enter a name for the list.");
      return;
    }
    if(newListName.length > 30) {
      alert("List name must be less than 30 characters.");
      return;
    }

    fetch("https://albumsortify.fr:3000/albumlist", {
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
          fetchLists(userIDSpotify, "");
        })
        .catch((error) => {
          console.error("Error adding new list:", error);
          alert("Error creating list.");
        });
}