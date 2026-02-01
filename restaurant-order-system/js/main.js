class RestaurantOrderSystem {
    constructor() {
        this.menu = [
            { id: 1, name: '凯撒沙拉', price: 28, category: 'appetizer', desc: '新鲜罗马生菜配帕玛森芝士和面包丁' },
            { id: 2, name: '法式洋葱汤', price: 32, category: 'appetizer', desc: '传统法式洋葱汤配烤面包和芝士' },
            { id: 3, name: '香煎鹅肝', price: 88, category: 'appetizer', desc: '配苹果酱和烤面包片' },
            { id: 4, name: '澳洲牛排', price: 128, category: 'main', desc: '精选澳洲牛肉，配时蔬和土豆泥' },
            { id: 5, name: '意大利面', price: 68, category: 'main', desc: '手工意面配番茄肉酱' },
            { id: 6, name: '烤三文鱼', price: 98, category: 'main', desc: '新鲜三文鱼配柠檬黄油汁' },
            { id: 7, name: '北京烤鸭', price: 158, category: 'main', desc: '传统工艺烤制，配薄饼和甜面酱' },
            { id: 8, name: '提拉米苏', price: 38, category: 'dessert', desc: '经典意大利甜品' },
            { id: 9, name: '巧克力熔岩蛋糕', price: 42, category: 'dessert', desc: '热巧克力蛋糕配香草冰淇淋' },
            { id: 10, name: '芒果布丁', price: 28, category: 'dessert', desc: '新鲜芒果制作，口感顺滑' },
            { id: 11, name: '拿铁咖啡', price: 35, category: 'drink', desc: '意式浓缩咖啡配蒸奶' },
            { id: 12, name: '鲜榨橙汁', price: 25, category: 'drink', desc: '新鲜橙子现榨' },
            { id: 13, name: '茉莉花茶', price: 18, category: 'drink', desc: '清香茉莉花茶' },
            { id: 14, name: '红酒', price: 88, category: 'drink', desc: '法国进口红酒' }
        ];
        
        this.order = [];
        this.currentCategory = 'all';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderMenu();
        this.renderOrder();
    }

    bindEvents() {
        // 分类按钮事件
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategory(e.target.dataset.category);
            });
        });

        // 添加到订单事件（使用事件委托）
        document.getElementById('menuItems').addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const id = parseInt(menuItem.dataset.id);
                this.addToOrder(id);
            }
        });

        // 订单操作事件（使用事件委托）
        document.getElementById('orderList').addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-plus')) {
                const id = parseInt(e.target.closest('.order-item').dataset.id);
                this.updateQuantity(id, 1);
            } else if (e.target.classList.contains('quantity-minus')) {
                const id = parseInt(e.target.closest('.order-item').dataset.id);
                this.updateQuantity(id, -1);
            } else if (e.target.classList.contains('remove-btn')) {
                const id = parseInt(e.target.closest('.order-item').dataset.id);
                this.removeFromOrder(id);
            }
        });

        // 清空订单事件
        document.getElementById('clearOrderBtn').addEventListener('click', () => {
            this.clearOrder();
        });

        // 提交订单事件
        document.getElementById('submitOrderBtn').addEventListener('click', () => {
            this.submitOrder();
        });
    }

    setCategory(category) {
        this.currentCategory = category;
        
        // 更新按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.renderMenu();
    }

    renderMenu() {
        const menuContainer = document.getElementById('menuItems');
        let filteredMenu = this.menu;

        if (this.currentCategory !== 'all') {
            filteredMenu = this.menu.filter(item => item.category === this.currentCategory);
        }

        menuContainer.innerHTML = '';

        filteredMenu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.id = item.id;
            menuItem.innerHTML = `
                <div class="menu-item-header">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">¥${item.price}</div>
                </div>
                <div class="menu-item-desc">${item.desc}</div>
                <div class="menu-item-category">${this.getCategoryName(item.category)}</div>
            `;
            menuContainer.appendChild(menuItem);
        });
    }

    getCategoryName(category) {
        const categories = {
            appetizer: '开胃菜',
            main: '主菜',
            dessert: '甜品',
            drink: '饮品'
        };
        return categories[category] || category;
    }

    addToOrder(itemId) {
        const item = this.menu.find(i => i.id === itemId);
        if (!item) return;

        // 检查是否已经在订单中
        const existingItem = this.order.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.order.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        this.renderOrder();
        this.showNotification(`已添加 ${item.name} 到订单`);
    }

    updateQuantity(itemId, change) {
        const item = this.order.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;

        // 如果数量变为0，则移除项目
        if (item.quantity <= 0) {
            this.removeFromOrder(itemId);
        } else {
            this.renderOrder();
        }
    }

    removeFromOrder(itemId) {
        this.order = this.order.filter(i => i.id !== itemId);
        this.renderOrder();
        this.showNotification('已从订单中移除项目');
    }

    clearOrder() {
        if (this.order.length === 0) {
            this.showNotification('订单已经是空的');
            return;
        }

        if (confirm('确定要清空整个订单吗？')) {
            this.order = [];
            this.renderOrder();
            this.showNotification('订单已清空');
        }
    }

    submitOrder() {
        if (this.order.length === 0) {
            this.showNotification('请先添加菜品到订单');
            return;
        }

        const tableNumber = document.getElementById('tableNumber').value;
        const customerCount = document.getElementById('customerCount').value;

        if (!tableNumber || !customerCount) {
            this.showNotification('请输入桌号和人数');
            return;
        }

        // 模拟提交订单
        const orderDetails = {
            tableNumber: tableNumber,
            customerCount: customerCount,
            items: [...this.order],
            total: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };

        console.log('提交订单:', orderDetails);
        this.showNotification(`订单已提交至厨房 - 桌号 ${tableNumber}`);
        
        // 可以在此处添加实际的订单提交逻辑
        // 例如发送到服务器或打印到厨房
        
        // 提交后清空订单
        setTimeout(() => {
            this.order = [];
            this.renderOrder();
        }, 2000);
    }

    renderOrder() {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '';

        this.order.forEach(item => {
            const orderItem = document.createElement('li');
            orderItem.className = 'order-item';
            orderItem.dataset.id = item.id;
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">¥${item.price} × ${item.quantity}</div>
                </div>
                <div class="order-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn quantity-minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn quantity-plus">+</button>
                    </div>
                    <button class="remove-btn">删除</button>
                </div>
            `;
            orderList.appendChild(orderItem);
        });

        document.getElementById('totalAmount').textContent = this.calculateTotal().toFixed(2);
    }

    calculateTotal() {
        return this.order.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        notificationText.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// 页面加载完成后初始化点餐系统
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantOrderSystem();
});