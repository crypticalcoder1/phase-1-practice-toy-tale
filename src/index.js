let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  fetchToys();

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      
      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;

      addNewToy(toyName, toyImage);
  });
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => renderToy(toy));
      })
      .catch(error => console.error("Error fetching toys:", error));
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  toyCollection.appendChild(card);
}

function addNewToy(name, image) {
  const toyData = {
      name: name,
      image: image,
      likes: 0
  };

  fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(toy => {
      renderToy(toy);
      toyForm.reset(); // Clear the form
  })
  .catch(error => console.error("Error adding toy:", error));
}

document.addEventListener("click", (event) => {
  if (event.target.className === "like-btn") {
      const toyId = event.target.id;
      const likesElement = event.target.previousElementSibling;
      const currentLikes = parseInt(likesElement.innerText);

      updateLikes(toyId, currentLikes);
  }
});

function updateLikes(id, currentLikes) {
  const newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
      const likesElement = document.getElementById(id).previousElementSibling;
      likesElement.innerText = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error("Error updating likes:", error));
}
