async function fetchAgriNews() {

    const container = document.getElementById("news-container");

    try {

        const response = await fetch(
            "https://newsapi.org/v2/everything?q=agriculture-india&apiKey=YOUR_API_KEY_HERE"
        );

        const data = await response.json();

        container.innerHTML = "";

        data.articles.slice(0, 3).forEach(article => {

            const card = `
                <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

                    <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=Agri+News'}"
                         class="w-full h-48 object-cover">

                    <div class="p-4">
                        <h3 class="font-bold text-lg leading-tight mb-2">${article.title}</h3>

                        <p class="text-gray-600 text-sm mb-4">
                            ${article.description?.substring(0,100)}...
                        </p>

                        <a href="${article.url}" target="_blank"
                           class="text-green-600 font-bold text-sm">
                           Read More →
                        </a>
                    </div>

                </div>
            `;

            container.innerHTML += card;

        });

    } catch (error) {

        container.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow">
                <h3 class="font-bold">Govt Announces New MSP</h3>
                <p class="text-sm text-gray-500 mt-2">
                Wheat prices expected to rise by 5% this season...
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow">
                <h3 class="font-bold">Organic Farming Trends 2026</h3>
                <p class="text-sm text-gray-500 mt-2">
                Indore farmers adopting new irrigation methods...
                </p>
            </div>
        `;

    }

}

fetchAgriNews();