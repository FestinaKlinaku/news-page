'use strict';

const newsCategories = document.querySelectorAll('.news__category');
const newsList = document.querySelector('.news__list');
const loadMore = document.querySelector('.news__load-more')
const loader = document.querySelector('.news__loader');
const bottomLoader = document.querySelector('.news__loader-wrapper');

const API = `https://balkaninsight.com/wp-json/wp/v2/posts?_embed=1&per_page=4`;

const categoryMap = {
    Albania: 206,
    Bulgaria: 211,
    Croatia: 191,
}; 
let selectedCategory = sessionStorage.getItem('id') || categoryMap.Albania;

newsCategories.forEach(button => {
    button.classList.remove('news__category--active');
    if (categoryMap[button.textContent] == selectedCategory) {
        button.classList.add('news__category--active');
    }
})

const fetchNews = async (category, pageNumber = 1) => {
    try {
        const res = await fetch(`${API}&categories=${category}&page=${pageNumber}`);
        if (!res.ok) throw new Error(`Problem getting news ${res.status}`);
        const data = await res.json();
        return data;
    }
    catch(err) {
        console.error(err.message);
        throw err;
    }
}

const renderNews = async (category, pageNumber = 1) => {
    try {
        if (pageNumber === 1) {
            loadMore.style.display = 'none';
            loader.style.display = 'block';
        } else {
            loadMore.style.display = 'none';
            bottomLoader.style.display = 'block';
        } 
        const news = await fetchNews(category, pageNumber);
        loader.style.display = 'none'
        bottomLoader.style.display = 'none';
        news.forEach(item => {
            const newsItem = `
                <article class="news__item">
                    <a class="news__link" href="single.html?id=${item.id}">
                        <h3 class="news__title">${item.title?.rendered}</h3>
                        <div class="news__image">
                            <img src="${item.yoast_head_json?.og_image[0]?.url}" alt="News Image">
                        </div>
                        <span class="news__date">${new Date(item.date)?.toLocaleDateString()}</span>
                        <div class="news__excerpt">${item.excerpt?.rendered}</div>
                    </a>
                </article>
            `
            newsList.insertAdjacentHTML('beforeend', newsItem);
        })
        loadMore.style.display = 'block';
    }
    catch(err) {
        console.error(err);
    }
}

renderNews(selectedCategory);

newsCategories.forEach(button => {
    button.addEventListener('click', () => {
        newsCategories.forEach(button => {
            button.classList.remove('news__category--active');
        })
        button.classList.add('news__category--active');
        if (categoryMap[button.textContent]) {
            selectedCategory = categoryMap[button.textContent];
            sessionStorage.clear();
            sessionStorage.setItem('id', selectedCategory);
        }
        newsList.innerHTML = '';
        renderNews(selectedCategory);
    })
})

let i = 1;
loadMore.addEventListener('click', () => {
    i++;
    renderNews(selectedCategory, i);
})