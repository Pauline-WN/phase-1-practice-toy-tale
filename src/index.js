let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const newToyForm = document.querySelector('.add-toy-form');
  const newToyBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  
  newToyBtn.addEventListener('click', () => {
    // Toggle visibility of the toy form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });

  // Fetch Andy's toys and render them
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  // Render each toy as a card in the toy collection
  function renderToy(toy) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = toy.id; // Store toy ID in dataset for reference

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');
    card.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    likeBtn.textContent = 'Like ❤️';
    likeBtn.dataset.id = toy.id; // Store toy ID in dataset for reference
    card.appendChild(likeBtn);

    toyCollection.appendChild(card);

    // Add event listener for the like button
    likeBtn.addEventListener('click', () => {
      updateLikes(toy);
    });
  }

  // Update toy likes
  function updateLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      // Update the DOM with the new likes
      const toyCard = document.querySelector(`.card[data-id="${updatedToy.id}"]`);
      const likeParagraph = toyCard.querySelector('p');
      likeParagraph.textContent = `${updatedToy.likes} Likes`;
    });
  }

  // Handle form submission to add a new toy
  newToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData(newToyForm);
    const name = formData.get('name');
    const image = formData.get('image');
    const likes = 0;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        image,
        likes
      })
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      newToyForm.reset();
      toyFormContainer.style.display = 'none'; // Hide the form after submission
      addToy = false; // Reset addToy flag
    });
  });

  // Initial fetch of toys
  fetchToys();
});
