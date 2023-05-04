"use strict";

const newsItem = document.querySelector(".news__article");
const loader = document.querySelector(".news__loader");
const goBack = document.querySelector(".news__go-back");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const API = `https://balkaninsight.com/wp-json/wp/v2/posts/${id}?_embed=1`;

const fetchSingleNews = async (id) => {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Problem getting news ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

const renderSingleNews = async (id) => {
  try {
    loader.style.display = "block";
    const item = await fetchSingleNews(id);
    setTimeout(() => {
        loader.style.display = 'none'
        const html = `
          <h3 class="news__title">${item.title?.rendered}</h3>
          <img class="news__image" src="${item.yoast_head_json?.og_image[0]?.url}" alt="Article Image">
          <div class="news__content">${item.content?.rendered}</div>
        `;
        newsItem.insertAdjacentHTML("beforeend", html);
        goBack.style.display = "block";
    }, 1000)
  } catch (err) {
    console.error(err);
  }
}

renderSingleNews(id);

goBack.addEventListener('click', () => {
    loader.style.display = "block";
    window.history.back();
})