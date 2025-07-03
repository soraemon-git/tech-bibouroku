/**
 * ブログ検索機能 & カテゴリ統合機能
 */

// スクリプト読み込み確認
console.log('🔍 search.js が読み込まれました');

class BlogSearch {
  constructor() {
    this.searchIndex = null;
    this.categoryData = null;
    this.isLoading = false;
    this.currentQuery = '';
    this.currentCategory = '';
    this.init();
  }

  async init() {
    try {
      await this.loadSearchIndex();
      await this.loadCategoryData();
      this.bindHeaderSearch();
      this.bindSearchPage();
      this.bindCategoryFilter();
      this.handleURLParams();
      
      // 検索ページで初期状態の場合、「すべて」カテゴリを表示
      if (window.location.pathname === '/search/') {
        const urlParams = new URLSearchParams(window.location.search);
        const hasQuery = urlParams.has('q');
        const hasCategory = urlParams.has('category');
        
        // URLパラメータがない場合は「すべて」カテゴリを表示
        if (!hasQuery && !hasCategory) {
          console.log('検索ページ初期表示：すべてのカテゴリを表示');
          this.filterByCategory('');
        }
      }
    } catch (error) {
      console.error('検索機能の初期化に失敗しました:', error);
    }
  }

  async loadSearchIndex() {
    if (this.searchIndex) return;
    
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error('検索インデックスの読み込みに失敗しました');
      const data = await response.json();
      
      // 検索インデックスの構造を確認
      console.log('検索インデックス構造:', data);
      
      // postsプロパティがある場合はそれを使用、ない場合は直接配列として扱う
      this.searchIndex = data.posts || data;
      
      console.log('検索可能な記事数:', this.searchIndex.length);
      if (this.searchIndex.length > 0) {
        console.log('最初の記事:', this.searchIndex[0]);
      }
    } catch (error) {
      console.error('検索インデックスの読み込みエラー:', error);
      throw error;
    }
  }

  async loadCategoryData() {
    try {
      const categoryElement = document.getElementById('category-data');
      if (categoryElement) {
        this.categoryData = JSON.parse(categoryElement.textContent);
      }
    } catch (error) {
      console.warn('カテゴリデータの読み込みに失敗しました:', error);
    }
  }

  bindHeaderSearch() {
    const headerInput = document.getElementById('search-input');
    const headerButton = document.querySelector('.search-button');
    const headerForm = document.querySelector('.search-container');
    
    if (!headerInput) {
      console.warn('ヘッダーの検索入力フィールドが見つかりません');
      return;
    }

    console.log('ヘッダー検索バインド完了:', {
      input: !!headerInput,
      button: !!headerButton,
      form: !!headerForm,
      inputValue: headerInput.value,
      inputId: headerInput.id
    });

    // 検索実行の共通関数
    const executeHeaderSearch = () => {
      const query = headerInput.value.trim();
      console.log('ヘッダー検索実行:', { query, length: query.length });
      if (query) {
        console.log('リダイレクト開始:', query);
        this.redirectToSearchPage(query);
      } else {
        console.warn('検索クエリが空です');
      }
    };

    // フォーム送信の処理（最優先）
    if (headerForm) {
      headerForm.addEventListener('submit', (e) => {
        console.log('フォーム送信イベント発生');
        e.preventDefault();
        e.stopPropagation();
        executeHeaderSearch();
      });
    }

    // ヘッダー検索入力でEnterキー（フォールバック）
    headerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        console.log('Enterキー押下イベント発生');
        e.preventDefault();
        e.stopPropagation();
        executeHeaderSearch();
      }
    });

    // ヘッダー検索ボタンクリック（フォールバック）
    if (headerButton) {
      headerButton.addEventListener('click', (e) => {
        console.log('検索ボタンクリックイベント発生');
        e.preventDefault();
        e.stopPropagation();
        executeHeaderSearch();
      });
    }

    // ヘッダー検索の即座表示（クイック検索）
    let searchTimeout;
    headerInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = headerInput.value.trim();
        console.log('入力変更:', query);
        if (query.length >= 2) {
          this.showQuickResults(headerInput, query);
        } else {
          this.hideQuickResults();
        }
      }, 300);
    });

    // 外部クリックでクイック結果を非表示
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideQuickResults();
      }
    });
  }

  bindSearchPage() {
    const searchInput = document.getElementById('search-page-input');
    const searchButton = document.getElementById('search-page-button');
    
    if (!searchInput) return;

    // 検索ページでの検索実行
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        this.executeSearch(query);
        this.updateURL(query);
      }
    };

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    if (searchButton) {
      searchButton.addEventListener('click', performSearch);
    }

    // リアルタイム検索（オプション）
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          this.executeSearch(query);
          this.updateURL(query);
        } else if (query.length === 0) {
          this.showWelcomeMessage();
        }
      }, 500);
    });
  }

  bindCategoryFilter() {
    // カテゴリナビゲーションの処理
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        this.filterByCategory(category);
        this.updateCategoryUI(category);
      });
    });

    // カテゴリタグの処理
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const category = tag.dataset.category;
        console.log('カテゴリタグクリック:', { category, tagText: tag.textContent.trim() });
        this.filterByCategory(category);
        this.updateCategoryTagsUI(category);
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;
    
    if (!this.categoryData) {
      console.warn('カテゴリデータが読み込まれていません');
      return;
    }

    console.log('カテゴリフィルター実行:', { category, categoryData: this.categoryData });

    // 「すべて」の場合は空文字列またはnullで検索
    const categoryInfo = this.categoryData.categories.find(cat => {
      if (category === '' || category === 'すべて') {
        return cat.slug === '' || cat.name === 'すべて';
      }
      return cat.slug === category || cat.name === category;
    });

    console.log('見つかったカテゴリ情報:', categoryInfo);

    if (categoryInfo) {
      this.displayCategoryResults(categoryInfo);
    } else {
      console.warn('カテゴリが見つかりません:', category);
    }
  }

  updateCategoryUI(selectedCategory) {
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.category === selectedCategory);
    });
  }

  updateCategoryTagsUI(selectedCategory) {
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
      const tagCategory = tag.dataset.category;
      // 「すべて」の場合は空文字列で比較
      if (selectedCategory === '' || selectedCategory === 'すべて') {
        tag.classList.toggle('active', tagCategory === '' || tag.textContent.trim() === 'すべて');
      } else {
        tag.classList.toggle('active', tagCategory === selectedCategory);
      }
    });
  }

  displayCategoryResults(categoryInfo) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const resultsHTML = `
      <div class="search-results-header">
        <h2 class="search-results-count">
          カテゴリ「${categoryInfo.name}」の記事 (${categoryInfo.posts.length}件)
        </h2>
      </div>
      <div class="search-results-list">
        ${categoryInfo.posts.map(post => this.renderPostItem(post)).join('')}
      </div>
    `;

    resultsContainer.innerHTML = resultsHTML;
    this.bindResultsInteraction();
  }

  renderPostItem(post) {
    return `
      <article class="search-result-item">
        <h3 class="search-result-title">
          <a href="${post.url}">${post.title}</a>
        </h3>
        <p class="search-result-excerpt">${post.excerpt || ''}</p>
        <div class="search-result-meta">
          <time datetime="${post.date}">${this.formatDate(post.date)}</time>
        </div>
      </article>
    `;
  }

  handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const category = urlParams.get('category');
    
    console.log('URL パラメータ処理:', { query, category, pathname: window.location.pathname });
    
    if (query) {
      const searchInput = document.getElementById('search-page-input');
      const headerInput = document.getElementById('search-input');
      
      // 検索ページの入力フィールドに値を設定
      if (searchInput) {
        searchInput.value = query;
        console.log('検索ページの入力フィールドに設定:', query);
      }
      
      // ヘッダーの入力フィールドにも値を設定
      if (headerInput) {
        headerInput.value = query;
        console.log('ヘッダーの入力フィールドに設定:', query);
      }
      
      // 検索を実行
      this.executeSearch(query);
    }

    if (category) {
      this.filterByCategory(category);
      this.updateCategoryUI(category);
    }
  }

  redirectToSearchPage(query) {
    if (!query) {
      console.warn('検索クエリが空です');
      return;
    }
    
    console.log('検索ページリダイレクト処理開始:', {
      query: query,
      currentPath: window.location.pathname,
      currentSearch: window.location.search
    });
    
    const searchUrl = `/search/?q=${encodeURIComponent(query)}`;
    console.log('生成されたURL:', searchUrl);
    
    // 現在のページが検索ページの場合は、リロードせずに検索実行
    if (window.location.pathname === '/search/') {
      console.log('検索ページ内での検索実行');
      const searchInput = document.getElementById('search-page-input');
      if (searchInput) {
        searchInput.value = query;
        this.executeSearch(query);
        this.updateURL(query);
        return;
      }
    }
    
    // 他のページから検索ページへ遷移
    console.log('ページ遷移開始:', searchUrl);
    try {
      window.location.href = searchUrl;
      console.log('ページ遷移完了');
    } catch (error) {
      console.error('ページ遷移エラー:', error);
    }
  }

  async executeSearch(query) {
    if (!query || this.isLoading) {
      console.warn('検索実行スキップ:', { query: query, isLoading: this.isLoading });
      return;
    }

    console.log('検索開始:', query);
    this.showLoading();
    this.isLoading = true;
    this.currentQuery = query;

    try {
      await this.loadSearchIndex();
      const results = this.performSearch(query);
      this.displaySearchResults(results, query);
    } catch (error) {
      this.showError('検索中にエラーが発生しました。');
      console.error('検索エラー:', error);
    } finally {
      this.isLoading = false;
    }
  }

  performSearch(query) {
    if (!this.searchIndex || !query) {
      console.warn('検索実行失敗:', {
        hasIndex: !!this.searchIndex,
        query: query,
        indexLength: this.searchIndex ? this.searchIndex.length : 0
      });
      return [];
    }

    console.log('検索実行:', {
      query: query,
      indexLength: this.searchIndex.length
    });

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const results = [];

    this.searchIndex.forEach((post, index) => {
      let score = 0;
      const content = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
      
      // タイトルマッチは高スコア
      searchTerms.forEach(term => {
        const titleMatches = (post.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
        
        score += titleMatches * 10 + contentMatches * 1;
        
        if (titleMatches > 0 || contentMatches > 0) {
          console.log(`記事 ${index} "${post.title}" マッチ:`, {
            term: term,
            titleMatches: titleMatches,
            contentMatches: contentMatches,
            score: score
          });
        }
      });

      // カテゴリフィルターが適用されている場合
      if (this.currentCategory && post.category !== this.currentCategory) {
        score = 0;
      }

      if (score > 0) {
        results.push({ ...post, score });
      }
    });

    console.log('検索結果:', {
      query: query,
      resultCount: results.length,
      results: results
    });

    return results.sort((a, b) => b.score - a.score);
  }

  displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-results-header">
          <h2 class="search-results-count">検索結果が見つかりませんでした</h2>
          <p>「${query}」に関する記事は見つかりませんでした。別のキーワードでお試しください。</p>
        </div>
      `;
      return;
    }

    const resultsHTML = `
      <div class="search-results-header">
        <h2 class="search-results-count">
          「${query}」の検索結果 (${results.length}件)
        </h2>
      </div>
      <div class="search-results-list">
        ${results.map(post => this.createPostCard(post, query)).join('')}
      </div>
    `;

    resultsContainer.innerHTML = resultsHTML;
    this.bindResultsInteraction();
  }

  createPostCard(post, query = '') {
    const highlightedTitle = this.highlightSearchTerms(post.title, query);
    const highlightedExcerpt = this.highlightSearchTerms(post.excerpt, query);
    
    return `
      <article class="search-result-item">
        <h3 class="search-result-title">
          <a href="${post.url}">${highlightedTitle}</a>
        </h3>
        <p class="search-result-excerpt">${highlightedExcerpt}</p>
        <div class="search-result-meta">
          <time datetime="${post.date}">${this.formatDate(post.date)}</time>
          ${post.category ? `<span class="search-result-category">${post.category}</span>` : ''}
        </div>
      </article>
    `;
  }

  showQuickResults(input, query) {
    if (!this.searchIndex) {
      console.warn('検索インデックスが読み込まれていません');
      return;
    }

    const results = this.performSearch(query).slice(0, 5);
    let suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'search-suggestions';
      input.parentElement.appendChild(suggestionsContainer);
      input.parentElement.style.position = 'relative';
    }

    if (results.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="search-suggestion-item no-results">
          <span class="suggestion-title">「${query}」の検索結果が見つかりません</span>
          <p class="suggestion-excerpt">検索ページで詳細検索を試してみてください</p>
        </div>
      `;
      
      // "検索結果なし"をクリックしても検索ページに遷移
      suggestionsContainer.querySelector('.no-results').addEventListener('click', () => {
        this.redirectToSearchPage(query);
      });
      
      return;
    }

    const suggestionsHTML = results.map(post => `
      <div class="search-suggestion-item" data-url="${post.url}">
        <span class="suggestion-title">${this.highlightSearchTerms(post.title, query)}</span>
        <p class="suggestion-excerpt">${this.highlightSearchTerms(post.excerpt, query)}</p>
        <div class="suggestion-meta">
          <span class="suggestion-date">${this.formatDate(post.date)}</span>
          ${post.category ? `<span class="suggestion-category">${post.category}</span>` : ''}
        </div>
      </div>
    `).join('');

    // "すべての結果を見る"リンクを追加
    const allResultsHTML = `
      <div class="search-suggestion-item view-all" data-url="/search/?q=${encodeURIComponent(query)}">
        <span class="suggestion-title">すべての結果を見る (${results.length}+ 件)</span>
        <p class="suggestion-excerpt">検索ページでより詳しい結果を確認</p>
      </div>
    `;

    suggestionsContainer.innerHTML = suggestionsHTML + allResultsHTML;

    // 候補クリックでページ遷移
    suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('view-all')) {
          this.redirectToSearchPage(query);
        } else {
          window.location.href = item.dataset.url;
        }
      });
    });
  }

  hideQuickResults() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  }

  highlightSearchTerms(text, query) {
    if (!query || !text) return text;
    
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="search-highlight">$1</span>');
    });
    
    return highlightedText;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  showLoading() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '<div class="search-loading">検索中...</div>';
    }
  }

  showError(message) {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `<div class="search-error">${message}</div>`;
    }
  }

  showWelcomeMessage() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-welcome">
          <h2>記事を検索</h2>
          <p>キーワードを入力して記事を検索できます。</p>
        </div>
      `;
    }
  }

  updateURL(query) {
    const url = new URL(window.location);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url);
  }

  bindResultsInteraction() {
    // 検索結果のインタラクション（今後拡張可能）
    const resultItems = document.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
      });
    });
  }
}

// ページ読み込み時に検索機能を初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded: 検索機能を初期化中...');
  try {
    window.blogSearch = new BlogSearch();
    console.log('✅ 検索機能の初期化完了');
    
    // 初期化後に要素の存在確認
    setTimeout(() => {
      const headerInput = document.getElementById('search-input');
      const headerButton = document.querySelector('.search-button');
      const headerForm = document.querySelector('.search-container');
      
      console.log('🔍 初期化後の要素確認:', {
        headerInput: !!headerInput,
        headerButton: !!headerButton,
        headerForm: !!headerForm,
        pathname: window.location.pathname
      });

      // 要素が見つからない場合の詳細調査
      if (!headerInput) {
        console.log('❌ search-input要素が見つかりません');
        const allInputs = document.querySelectorAll('input');
        console.log('📋 ページ内のすべてのinput要素:', allInputs);
      }
      
    }, 100);
    
  } catch (error) {
    console.error('❌ 検索機能の初期化エラー:', error);
  }
});

// ページがすでに読み込まれている場合（動的読み込み等）
if (document.readyState === 'loading') {
  console.log('⏳ DOM読み込み中...');
} else {
  // DOMが既に読み込み済み
  console.log('⚡ DOM既読み込み済み: 検索機能を初期化中...');
  try {
    window.blogSearch = new BlogSearch();
    console.log('✅ 検索機能の初期化完了');
  } catch (error) {
    console.error('❌ 検索機能の初期化エラー:', error);
  }
}
