// ===== 购物车功能 =====
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
        // 购物车按钮点击
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('open');
                cartOverlay.classList.add('open');
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('open');
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
                cartOverlay.classList.remove('open');
            });
        }

        // 添加到购物车按钮
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.getProductInfo(productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} 已加入购物车`);
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getProductInfo(productId) {
        const products = {
            '1': { name: '挪威深海三文鱼', price: 128 },
            '2': { name: '蓝鳍金枪鱼刺身', price: 268 },
            '3': { name: '波士顿龙虾', price: 388 },
            '4': { name: '阳澄湖大闸蟹', price: 198 },
            '5': { name: '新鲜鲈鱼', price: 58 },
            '6': { name: '东海带鱼', price: 88 },
            '7': { name: '银鳕鱼', price: 198 },
            '8': { name: '帝王鲑', price: 328 },
            '9': { name: '基围虾', price: 78 },
            '10': { name: '皮皮虾', price: 68 },
            '11': { name: '帝王蟹', price: 688 },
            '12': { name: '黑虎虾', price: 118 }
        };
        return products[productId];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        // 更新购物车数量徽章
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        // 更新购物车侧边栏内容
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<div class="cart-empty">购物车是空的</div>';
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <div class="cart-item-image">
                            <svg viewBox="0 0 100 60" class="fish-icon">
                                <path d="M10 30 Q30 10 60 20 Q80 25 90 30 Q80 35 60 40 Q30 50 10 30" fill="none" stroke="#1a1a1a" stroke-width="2"/>
                                <path d="M90 30 L100 20 L95 30 L100 40 Z" fill="none" stroke="#1a1a1a" stroke-width="2"/>
                                <circle cx="35" cy="27" r="2" fill="#1a1a1a"/>
                            </svg>
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">¥${item.price}</div>
                            <div class="cart-item-actions">
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                                <span class="remove-item" onclick="cart.removeFromCart('${item.id}')">删除</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 更新总价
        if (cartTotal) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `¥${total}`;
        }
    }

    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background-color: #1a1a1a;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1300;
            font-size: 0.9rem;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== 登录弹窗 =====
class LoginModal {
    constructor() {
        this.init();
    }

    init() {
        const userBtn = document.getElementById('userBtn');
        const loginModal = document.getElementById('loginModal');
        const closeLogin = document.getElementById('closeLogin');

        if (userBtn) {
            userBtn.addEventListener('click', () => {
                loginModal.classList.add('open');
            });
        }

        if (closeLogin) {
            closeLogin.addEventListener('click', () => {
                loginModal.classList.remove('open');
            });
        }

        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.remove('open');
                }
            });
        }

        // 表单提交
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('登录功能演示 - 实际项目中需要后端支持');
                loginModal.classList.remove('open');
            });
        }
    }
}

// ===== 移动端菜单 =====
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                // 简单的移动端菜单切换
                const navMenu = document.querySelector('.nav-menu');
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.flexDirection = 'column';
                navMenu.style.backgroundColor = 'rgba(250, 250, 250, 0.98)';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
        }
    }
}

// ===== 产品筛选功能 =====
class ProductFilter {
    constructor() {
        this.init();
    }

    init() {
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
        
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filterProducts();
            });
        });

        // 排序功能
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortProducts(sortSelect.value);
            });
        }
    }

    filterProducts() {
        const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const category = card.dataset.category;
            if (checkedCategories.length === 0 || checkedCategories.includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // 更新结果数
        const visibleCards = document.querySelectorAll('.product-card[style="display: block;"], .product-card:not([style*="display: none"])');
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            resultsCount.textContent = `共 ${visibleCards.length} 件商品`;
        }
    }

    sortProducts(sortType) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
        
        productCards.sort((a, b) => {
            const priceA = this.getPrice(a);
            const priceB = this.getPrice(b);

            switch (sortType) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'newest':
                    return parseInt(b.dataset.productId) - parseInt(a.dataset.productId);
                default:
                    return 0;
            }
        });

        productCards.forEach(card => productGrid.appendChild(card));
    }

    getPrice(card) {
        const priceText = card.querySelector('.product-price').textContent;
        return parseInt(priceText.replace(/[^0-9]/g, ''));
    }
}

// ===== 平滑滚动 =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== 滚动动画 =====
class ScrollAnimation {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        document.querySelectorAll('.product-card, .feature-item, .category-card, .value-card, .team-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // 添加动画类样式
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== 导航栏滚动效果 =====
class NavbarScroll {
    constructor() {
        this.init();
    }

    init() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }
}

// ===== 搜索功能 =====
class SearchFunction {
    constructor() {
        this.init();
    }

    init() {
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = prompt('请输入搜索关键词：');
                if (searchTerm) {
                    alert(`搜索功能演示 - 搜索 "${searchTerm}"\n实际项目中需要后端搜索支持`);
                }
            });
        }
    }
}

// ===== 初始化所有功能 =====
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
    new LoginModal();
    new MobileMenu();
    new ProductFilter();
    new SmoothScroll();
    new ScrollAnimation();
    new NavbarScroll();
    new SearchFunction();
});
