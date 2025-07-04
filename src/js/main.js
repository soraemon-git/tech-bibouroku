// メインJavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 main.js DOMContentLoaded');
    
    // ダークモード切替機能
    initThemeToggle();
    
    // 固定ヘッダー機能
    initStickyHeader();
    
    // スムーススクロール
    initSmoothScroll();
    
    // 記事カードのホバーアニメーション
    initPostCardAnimations();
    
    // 検索機能の確認（バックアップ）
    setTimeout(() => {
        if (!window.blogSearch) {
            console.log('⚠️ 検索機能が初期化されていません。main.jsから再試行します。');
            const searchScript = document.querySelector('script[src="/js/search.js"]');
            console.log('🔍 search.jsスクリプトタグ:', !!searchScript);
        } else {
            console.log('✅ 検索機能は正常に初期化されています');
        }
    }, 500);
});

// 固定ヘッダー機能
function initStickyHeader() {
    const stickyNav = document.getElementById('sticky-nav');
    const header = document.querySelector('.site-header');
    const themeToggle = document.getElementById('theme-toggle');
    const stickyThemeToggle = document.getElementById('theme-toggle-sticky');
    
    if (!stickyNav || !header) return;
    
    let headerHeight = header.offsetHeight;
    let lastScrollY = 0;
    let ticking = false;
    
    // スクロール位置に応じて固定ヘッダーを表示/非表示
    function updateStickyHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > headerHeight) {
            // ヘッダーが見えなくなったら固定ナビを表示
            stickyNav.classList.add('show');
            document.body.classList.add('sticky-nav-active');
        } else {
            // ヘッダーが見えるときは固定ナビを非表示
            stickyNav.classList.remove('show');
            document.body.classList.remove('sticky-nav-active');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    // スクロールイベントの処理
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateStickyHeader);
            ticking = true;
        }
    }
    
    // リサイズ時にヘッダーの高さを更新
    function updateHeaderHeight() {
        headerHeight = header.offsetHeight;
    }
    
    // 固定ナビのテーマ切替ボタンの同期
    function syncThemeToggle() {
        if (themeToggle && stickyThemeToggle) {
            // 既存のイベントリスナーを削除してから新しいものを追加
            stickyThemeToggle.removeEventListener('click', handleStickyThemeToggle);
            stickyThemeToggle.addEventListener('click', handleStickyThemeToggle);
        }
    }
    
    function handleStickyThemeToggle() {
        themeToggle.click(); // メインのボタンをクリック
    }
    
    // イベントリスナーの設定
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    
    // 初期化
    updateHeaderHeight();
    syncThemeToggle();
}

// ダークモード切替
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // 保存されたテーマまたはシステム設定を取得
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;
    
    // 初期テーマ設定
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // クリックイベント
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // アニメーション効果
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // システムテーマ変更の監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

// テーマアイコン更新（全てのテーマ切替ボタンを更新）
function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('.theme-icon');
    themeIcons.forEach(icon => {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    });
}

// スムーススクロール
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const stickyNav = document.querySelector('.sticky-nav');
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const stickyNavHeight = stickyNav ? stickyNav.offsetHeight : 0;
                
                // スクロール位置に応じてオフセットを調整
                const isScrolledPastHeader = window.scrollY > headerHeight;
                const offset = isScrolledPastHeader ? stickyNavHeight : headerHeight;
                
                const targetPosition = target.offsetTop - offset - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 記事カードアニメーション（無効化）
function initPostCardAnimations() {
    // アニメーションを無効化し、すべての記事カードを即座に表示
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        // 即座に表示状態にする
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'none';
        
        // 記事カード全体にクリックイベントを追加
        const link = card.querySelector('.post-card__link');
        if (link) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Card clicked, navigating to:', link.href);
                window.location.href = link.href;
            });
        }
    });
}

// ユーティリティ関数
const utils = {
    // 要素が画面内にあるかチェック
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // デバウンス関数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 日付フォーマット
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// グローバルに公開
window.BlogUtils = utils;
