// 每日菜单规划系统
class MealPlanner {
    constructor() {
        this.meals = JSON.parse(localStorage.getItem('meal-plans')) || {};
        this.currentDate = new Date();
        this.selectedMeal = null;
        this.sampleDishes = [
            // 早餐
            { id: 1, name: '豆浆油条套餐', description: '香浓豆浆配酥脆油条', price: '8元', category: 'breakfast' },
            { id: 2, name: '煎饼果子', description: '薄脆煎饼配鸡蛋酱料', price: '6元', category: 'breakfast' },
            { id: 3, name: '包子粥品', description: '多种口味包子配白粥', price: '10元', category: 'breakfast' },
            { id: 4, name: '牛奶麦片', description: '营养麦片配新鲜牛奶', price: '12元', category: 'breakfast' },
            { id: 5, name: '三明治套餐', description: '火腿蛋三明治配果汁', price: '15元', category: 'breakfast' },
            { id: 6, name: '小笼包', description: '汤汁丰富的小笼包', price: '12元', category: 'breakfast' },
            
            // 午餐
            { id: 7, name: '宫保鸡丁', description: '经典川菜，酸甜微辣', price: '22元', category: 'lunch' },
            { id: 8, name: '红烧肉', description: '肥瘦相间，入口即化', price: '28元', category: 'lunch' },
            { id: 9, name: '麻婆豆腐', description: '嫩滑豆腐配麻辣肉末', price: '18元', category: 'lunch' },
            { id: 10, name: '糖醋里脊', description: '酸甜可口，外酥内嫩', price: '25元', category: 'lunch' },
            { id: 11, name: '鱼香肉丝', description: '鱼香味浓郁，口感丰富', price: '20元', category: 'lunch' },
            { id: 12, name: '西红柿鸡蛋面', description: '家常味道，营养均衡', price: '16元', category: 'lunch' },
            { id: 13, name: '黄焖鸡米饭', description: '鸡肉嫩滑，汤汁浓郁', price: '20元', category: 'lunch' },
            { id: 14, name: '水煮鱼', description: '鲜嫩鱼片配蔬菜', price: '35元', category: 'lunch' },
            
            // 晚餐
            { id: 15, name: '清蒸鲈鱼', description: '鲜美鲈鱼，清淡健康', price: '45元', category: 'dinner' },
            { id: 16, name: '红烧狮子头', description: '软糯可口，肉质鲜美', price: '32元', category: 'dinner' },
            { id: 17, name: '干锅花菜', description: '花菜爽脆，配菜丰富', price: '24元', category: 'dinner' },
            { id: 18, name: '蒜蓉粉丝扇贝', description: '海鲜鲜美，蒜香浓郁', price: '38元', category: 'dinner' },
            { id: 19, name: '白切鸡', description: '鸡肉嫩滑，蘸料丰富', price: '30元', category: 'dinner' },
            { id: 20, name: '砂锅粥', description: '温润滋补，口感绵密', price: '28元', category: 'dinner' },
            
            // 素食
            { id: 21, name: '素炒河粉', description: '豆芽韭菜炒河粉', price: '15元', category: 'vegetarian' },
            { id: 22, name: '麻婆豆腐', description: '嫩滑豆腐配麻辣肉末', price: '18元', category: 'vegetarian' },
            { id: 23, name: '凉拌黄瓜', description: '清爽解腻，口感脆嫩', price: '8元', category: 'vegetarian' },
            { id: 24, name: '素三鲜饺子', description: '韭菜鸡蛋虾皮馅饺子', price: '18元', category: 'vegetarian' },
            
            // 辣味
            { id: 25, name: '麻辣烫', description: '多种食材任选搭配', price: '18元', category: 'spicy' },
            { id: 26, name: '口水鸡', description: '麻辣鲜香，鸡肉嫩滑', price: '26元', category: 'spicy' },
            { id: 27, name: '剁椒鱼头', description: '鲜辣剁椒配嫩鱼头', price: '58元', category: 'spicy' },
            { id: 28, name: '重庆小面', description: '麻辣鲜香，面条劲道', price: '16元', category: 'spicy' }
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDateDisplay();
        this.loadTodayMenu();
    }

    bindEvents() {
        // 日期选择器事件
        document.getElementById('prevDay').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('nextDay').addEventListener('click', () => this.changeDate(1));
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        document.getElementById('selectedDate').addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            this.currentDate = selectedDate;
            this.updateDateDisplay();
            this.loadMenuForDate();
        });

        // 添加菜品按钮事件
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedMeal = e.target.dataset.meal;
                this.openDishSelector();
            });
        });

        // 模态框事件
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });

        // 搜索和分类事件
        document.getElementById('searchDish').addEventListener('input', (e) => this.filterDishes(e.target.value));
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategoryFilter(e.target.dataset.category);
            });
        });
    }

    changeDate(days) {
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.updateDateDisplay();
        this.loadMenuForDate();
    }

    goToToday() {
        this.currentDate = new Date();
        this.updateDateDisplay();
        this.loadMenuForDate();
    }

    updateDateDisplay() {
        const dateInput = document.getElementById('selectedDate');
        const dateDisplay = document.getElementById('dateDisplay');
        
        // 设置日期输入框的值
        const formattedDate = this.formatDateForInput(this.currentDate);
        dateInput.value = formattedDate;
        
        // 设置显示文本
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        
        const year = this.currentDate.getFullYear();
        const month = monthNames[this.currentDate.getMonth()];
        const day = this.currentDate.getDate();
        const weekday = weekdays[this.currentDate.getDay()];
        
        dateDisplay.textContent = `${year}年${month}${day}日 ${weekday}`;
    }

    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadTodayMenu() {
        const today = new Date();
        this.currentDate = today;
        this.updateDateDisplay();
        this.loadMenuForDate();
    }

    loadMenuForDate() {
        const dateKey = this.getDateKey(this.currentDate);
        const dayMeals = this.meals[dateKey] || { breakfast: [], lunch: [], dinner: [] };
        
        this.renderMealContent('breakfast', dayMeals.breakfast);
        this.renderMealContent('lunch', dayMeals.lunch);
        this.renderMealContent('dinner', dayMeals.dinner);
    }

    renderMealContent(mealType, dishes) {
        const contentDiv = document.getElementById(`${mealType}-content`);
        
        if (dishes.length === 0) {
            contentDiv.innerHTML = '<div class="empty-meal"><span>点击+添加菜品</span></div>';
            return;
        }
        
        contentDiv.innerHTML = dishes.map(dish => `
            <div class="dish-item" data-dish-id="${dish.id}">
                <div class="dish-info">
                    <div class="dish-name">${dish.name}</div>
                    <div class="dish-desc">${dish.description}</div>
                </div>
                <div class="dish-price">${dish.price}</div>
                <button class="remove-btn" onclick="mealPlanner.removeDish('${mealType}', ${dish.id})">删除</button>
            </div>
        `).join('');
    }

    openDishSelector() {
        document.getElementById('modalOverlay').classList.add('active');
        this.renderDishGrid();
        this.setCategoryFilter('all');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        this.selectedMeal = null;
    }

    renderDishGrid(category = 'all', searchTerm = '') {
        const dishGrid = document.getElementById('dishGrid');
        let filteredDishes = this.sampleDishes;
        
        if (category !== 'all') {
            filteredDishes = filteredDishes.filter(dish => dish.category === category);
        }
        
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filteredDishes = filteredDishes.filter(dish => 
                dish.name.toLowerCase().includes(lowerSearch) || 
                dish.description.toLowerCase().includes(lowerSearch)
            );
        }
        
        dishGrid.innerHTML = filteredDishes.map(dish => `
            <div class="dish-card" onclick="mealPlanner.selectDish(${dish.id})">
                <h4>${dish.name}</h4>
                <p>${dish.description}</p>
                <div class="price">${dish.price}</div>
            </div>
        `).join('');
    }

    selectDish(dishId) {
        const dish = this.sampleDishes.find(d => d.id === dishId);
        if (!dish) return;
        
        const dateKey = this.getDateKey(this.currentDate);
        if (!this.meals[dateKey]) {
            this.meals[dateKey] = { breakfast: [], lunch: [], dinner: [] };
        }
        
        // 检查是否已存在该菜品
        const existingIndex = this.meals[dateKey][this.selectedMeal].findIndex(d => d.id === dishId);
        if (existingIndex === -1) {
            // 添加菜品
            this.meals[dateKey][this.selectedMeal].push(dish);
            this.saveMeals();
            this.loadMenuForDate();
            this.closeModal();
            
            // 添加动画效果
            this.animateAddDish(dish.name);
        }
    }

    removeDish(mealType, dishId) {
        const dateKey = this.getDateKey(this.currentDate);
        if (this.meals[dateKey]) {
            this.meals[dateKey][mealType] = this.meals[dateKey][mealType].filter(dish => dish.id !== dishId);
            this.saveMeals();
            this.loadMenuForDate();
            
            // 添加动画效果
            this.animateRemoveDish();
        }
    }

    animateAddDish(dishName) {
        // 创建一个飞行动画效果
        const notification = document.createElement('div');
        notification.textContent = `已添加：${dishName}`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #4CAF50, #8BC34A);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 2000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInOut 2s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    animateRemoveDish() {
        // 添加移除动画
    }

    filterDishes(searchTerm) {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        this.renderDishGrid(activeCategory, searchTerm);
    }

    setCategoryFilter(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        const searchTerm = document.getElementById('searchDish').value;
        this.renderDishGrid(category, searchTerm);
    }

    getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    saveMeals() {
        localStorage.setItem('meal-plans', JSON.stringify(this.meals));
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.mealPlanner = new MealPlanner();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInOut {
        0% { opacity: 0; transform: translate(-50%, calc(-50% - 20px)); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); }
    }
`;
document.head.appendChild(style);