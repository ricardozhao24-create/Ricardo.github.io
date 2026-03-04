document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const baseFilter = document.getElementById('baseFilter');
    const tagFilter = document.getElementById('tagFilter');
    const cocktailsGrid = document.getElementById('cocktailsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const modal = document.getElementById('cocktailModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');

    let filteredCocktails = [...cocktailsData];

    function createCocktailCard(cocktail) {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        card.addEventListener('click', () => showCocktailDetails(cocktail));

        const tagsHtml = cocktail.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        card.innerHTML = `
            <h3>${cocktail.name}</h3>
            <p class="name-en">${cocktail.nameEn}</p>
            <div class="base-info">
                <span class="base-label">基酒</span>
                <span class="base-value">${cocktail.base}</span>
            </div>
            <p class="description">${cocktail.flavor}</p>
            <div class="tags">${tagsHtml}</div>
        `;

        return card;
    }

    function renderCocktails(cocktails) {
        cocktailsGrid.innerHTML = '';
        
        if (cocktails.length === 0) {
            cocktailsGrid.innerHTML = `
                <div class="no-results">
                    <h3>未找到匹配的鸡尾酒</h3>
                    <p>请尝试其他搜索词或筛选条件</p>
                </div>
            `;
            resultsCount.textContent = `共 0 款`;
            return;
        }

        cocktails.forEach(cocktail => {
            const card = createCocktailCard(cocktail);
            cocktailsGrid.appendChild(card);
        });

        resultsCount.textContent = `共 ${cocktails.length} 款`;
    }

    function filterCocktails() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const baseValue = baseFilter.value;
        const tagValue = tagFilter.value;

        filteredCocktails = cocktailsData.filter(cocktail => {
            const matchesSearch = searchTerm === '' || 
                cocktail.name.toLowerCase().includes(searchTerm) ||
                cocktail.nameEn.toLowerCase().includes(searchTerm) ||
                cocktail.base.includes(searchTerm) ||
                cocktail.ingredients.includes(searchTerm) ||
                cocktail.steps.includes(searchTerm) ||
                cocktail.flavor.includes(searchTerm) ||
                cocktail.tags.some(tag => tag.includes(searchTerm));

            const matchesBase = baseValue === 'all' || cocktail.base === baseValue;
            
            const matchesTag = tagValue === 'all' || cocktail.tags.includes(tagValue);

            return matchesSearch && matchesBase && matchesTag;
        });

        renderCocktails(filteredCocktails);
    }

    function showCocktailDetails(cocktail) {
        document.getElementById('modalTitle').textContent = cocktail.name;
        document.getElementById('modalNameEn').textContent = cocktail.nameEn;
        
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = cocktail.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        document.getElementById('modalBase').textContent = cocktail.base;
        document.getElementById('modalIngredients').textContent = cocktail.ingredients;
        document.getElementById('modalSteps').textContent = cocktail.steps;
        document.getElementById('modalFlavor').textContent = cocktail.flavor;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    searchInput.addEventListener('input', filterCocktails);
    baseFilter.addEventListener('change', filterCocktails);
    tagFilter.addEventListener('change', filterCocktails);

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    renderCocktails(cocktailsData);
});
