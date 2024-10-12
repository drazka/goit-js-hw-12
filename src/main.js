document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const loader = document.getElementById('loader');
        loader.style.display = 'block'; 

        const q = document.getElementById('searchQuery').value;
        const apiKey = '46413447-a6948cf821c6d061f8e7d4db1';
        const perPage = 18;
        let currentPage = 1;
        let totalHits = 0;
        let loadedImages = 0;

        async function fetchImages(query, page) {
            const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;
            
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        }

        function displayImages(data) {
            const galleryDiv = document.getElementById('gallery');

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

                loadedImages += data.hits.length;

                const loadMoreButton = document.getElementById('loadMoreButton');
                if (loadedImages < totalHits) {
                    loadMoreButton.style.display = 'block';
                } else {
                    loadMoreButton.style.display = 'none';
                    iziToast.info({
                        message: "We're sorry, but you've reached the end of search results.",
                        position: 'topCenter',
                        backgroundColor: '#4CAF50',
                        position: 'topRight',
                        messageColor: '#FAFAFB'
                    });
                }

                const firstImageCard = document.querySelector('.image-card');
                if (firstImageCard) {
                    const cardHeight = firstImageCard.getBoundingClientRect().height;
                    window.scrollBy({
                        top: cardHeight * 2,
                        behavior: 'smooth'
                    });
                }
            }
        }

        const data = await fetchImages(q, currentPage);
        if (data) {
            totalHits = data.totalHits; 
            displayImages(data);
        }

        loader.style.display = 'none';

        document.getElementById('loadMoreButton').addEventListener('click', async function() {
            const loadMoreButton = document.getElementById('loadMoreButton');
            loadMoreButton.style.display = 'none';
            loader.style.display = 'block';
            currentPage += 1;
            const moreData = await fetchImages(q, currentPage);
            if (moreData) {
                displayImages(moreData);
            }
            loader.style.display = 'none';
        });
    });
});