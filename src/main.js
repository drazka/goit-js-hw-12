document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("button");

    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 

    const q = document.getElementById('searchQuery').value;
    const apiKey = '46413447-a6948cf821c6d061f8e7d4db1';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const galleryDiv = document.getElementById('gallery');
            galleryDiv.innerHTML = ''; 

            if (data.hits.length === 0) {
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'topCenter',
                    backgroundColor: '#EF4040',
                    position: 'topRight',
                    iconUrl: './img/x-octagon.svg',
                    iconColor: 'white',
                    messageColor: '#FAFAFB'
                });
            } else {
                data.hits.forEach(hit => {
                    const imageCard = document.createElement('div');
                    imageCard.className = 'image-card';

                    const linkElement = document.createElement('a');
                    linkElement.href = hit.largeImageURL;
                    linkElement.setAttribute('data-lightbox', 'gallery');

                    const imgElement = document.createElement('img');
                    imgElement.src = hit.webformatURL;
                    imgElement.alt = hit.tags;

                    const imageInfo = document.createElement('div');
                    imageInfo.className = 'image-info';
                    imageInfo.innerHTML = `
                        <p><strong>Likes:</strong> ${hit.likes}</p>
                        <p><strong>Views:</strong> ${hit.views}</p>
                        <p><strong>Comments:</strong> ${hit.comments}</p>
                        <p><strong>Downloads:</strong> ${hit.downloads}</p>
                    `;

                    linkElement.appendChild(imgElement);
                    imageCard.appendChild(linkElement);
                    imageCard.appendChild(imageInfo);
                    galleryDiv.appendChild(imageCard);
                });

                const lightbox = new SimpleLightbox('#gallery a', { /* options */ });
                lightbox.refresh();
            }
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loader.style.display = 'none';
        });
});