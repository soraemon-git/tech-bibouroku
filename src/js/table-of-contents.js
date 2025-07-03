/**
 * 目次（Table of Contents）生成機能
 */

class TableOfContents {
  constructor() {
    this.tocNav = document.getElementById('toc-nav');
    this.contentBody = document.getElementById('post-content-body');
    this.headings = [];
    this.activeIndex = 0;
    
    if (this.tocNav && this.contentBody) {
      this.init();
    }
  }

  init() {
    this.generateTOC();
    this.setupScrollSpy();
    this.setupSmoothScroll();
  }

  generateTOC() {
    // 見出し要素を取得（h2, h3, h4）
    this.headings = Array.from(
      this.contentBody.querySelectorAll('h2, h3, h4')
    );

    if (this.headings.length === 0) {
      this.tocNav.innerHTML = '<p class="toc-empty">目次はありません</p>';
      return;
    }

    // 各見出しにIDを追加（より確実な方法）
    this.headings.forEach((heading, index) => {
      if (!heading.id) {
        // 見出しのテキストからIDを生成
        const text = heading.textContent.trim();
        const safeId = `heading-${index}-${text.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`;
        heading.id = safeId;
      }
      
      // デバッグ用：見出しに視覚的なマーカーを追加
      heading.setAttribute('data-toc-index', index);
    });

    // 目次HTMLを生成
    const tocHTML = this.generateTOCHTML();
    this.tocNav.innerHTML = tocHTML;
  }

  generateTOCHTML() {
    const tocItems = this.headings.map((heading, index) => {
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent.trim();
      const id = heading.id;
      
      return `
        <div class="toc-item">
          <a href="#${id}" 
             class="toc-link" 
             data-level="${level.substring(1)}"
             data-index="${index}">
            ${text}
          </a>
        </div>
      `;
    }).join('');

    return `<div class="toc-list">${tocItems}</div>`;
  }

  setupScrollSpy() {
    // Intersection Observer で現在の見出しを追跡
    const observerOptions = {
      rootMargin: '-100px 0px -60% 0px', // ヘッダー分を考慮した調整
      threshold: [0, 0.1, 0.5, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      // 最も画面に表示されている見出しを特定
      let mostVisibleEntry = null;
      let maxIntersectionRatio = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
          mostVisibleEntry = entry;
          maxIntersectionRatio = entry.intersectionRatio;
        }
      });

      if (mostVisibleEntry) {
        const index = this.headings.indexOf(mostVisibleEntry.target);
        if (index !== -1) {
          this.setActiveItem(index);
        }
      }
    }, observerOptions);

    this.headings.forEach(heading => {
      observer.observe(heading);
    });
  }

  setupSmoothScroll() {
    // 目次リンククリック時のスムーススクロール
    this.tocNav.addEventListener('click', (e) => {
      e.preventDefault();
      
      const link = e.target.closest('.toc-link');
      if (!link) return;

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // より正確なヘッダー高さの計算
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 80;
        
        // ページ上部からの正確な位置を計算
        const elementRect = targetElement.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = elementRect.top + currentScrollY - headerHeight - 30;
        
        // スムーススクロール実行
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });

        // アクティブ状態を更新（少し遅延させて正確に）
        setTimeout(() => {
          const index = parseInt(link.getAttribute('data-index'));
          this.setActiveItem(index);
        }, 100);
      }
    });
  }

  setActiveItem(index) {
    if (this.activeIndex === index) return;

    // 前のアクティブアイテムを無効化
    const prevActive = this.tocNav.querySelector('.toc-link.active');
    if (prevActive) {
      prevActive.classList.remove('active');
    }

    // 新しいアクティブアイテムを設定
    const newActive = this.tocNav.querySelector(`[data-index="${index}"]`);
    if (newActive) {
      newActive.classList.add('active');
      this.activeIndex = index;

      // 目次内でアクティブアイテムが見えるようにスクロール
      newActive.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  new TableOfContents();
});

// ページが既に読み込まれている場合（キャッシュなど）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TableOfContents();
  });
} else {
  new TableOfContents();
}
