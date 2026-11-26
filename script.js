
const products = FreshDrinkCatalog.read();
let cart = [];

function escapeHtml(value) {
    return FreshDrinkCatalog.escapeHtml(value);
}

// แสดงสินค้า
function displayProducts() {
    const menuList = document.getElementById("menu-list");
    const featuredProducts = [
        { id: 7, badge: "STRAWBERRY FIZZ", description: "ซ่า หอมหวาน สดชื่น" },
        { id: 6, badge: "FRESH ORANGE", description: "สดใส เปรี้ยวหวานลงตัว" },
        { id: 8, badge: "CLASSIC LIMEADE", description: "ซิตรัสซ่า สดชื่น" },
        { id: 18, badge: "BLUE TROPIC", description: "หอมผลไม้ ซ่าถึงใจ" },
        { id: 10, badge: "ICED LEMON TEA", description: "ชาหอม เปรี้ยวละมุน" },
        { id: 14, badge: "MINT CHOC CHILL", description: "เข้มข้น หอมมิ้นต์" }
    ];
    const featuredIds = new Set(featuredProducts.map(product => product.id));
    const featuredMenu = featuredProducts
        .map(featured => {
            const product = products.find(item => item.id === featured.id);
            return product ? { ...product, ...featured } : null;
        })
        .filter(product => product !== null);
    const orderedProducts = [
        ...featuredMenu,
        ...products.filter(product => !featuredIds.has(product.id))
    ];

    menuList.innerHTML = orderedProducts.map((product, index) => `
        <article class="product-card product-tone-${index % 6}">
            <div class="product-visual">
                <span class="product-tag">${product.badge || "BAAN NAM CHONG"}</span>
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}"
                     loading="${index < 6 ? "eager" : "lazy"}"
                     fetchpriority="${index < 6 ? "high" : "auto"}">
            </div>
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p class="product-desc">${escapeHtml(product.description || "สดชื่น อร่อย พร้อมเสิร์ฟ")}</p>
                <p class="product-price">${product.price} บาท</p>
                <button class="add-btn"
                    onclick="addToCart(${product.id})">
                    เพิ่มลงตะกร้า
                </button>
            </div>
        </article>
    `).join("");
}

// เพิ่มสินค้า
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

// ลดจำนวนสินค้า
function decreaseQuantity(id) {
    const cartItem = cart.find(item => item.id === id);

    if (!cartItem) return;

    cartItem.quantity--;

    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    renderCart();
}

// เพิ่มจำนวนสินค้าในตะกร้า
function increaseQuantity(id) {
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    }

    renderCart();
}

// ลบสินค้า
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// แสดงตะกร้า
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");

    if (!cartItems || !totalPrice) {
        throw new Error("ไม่พบส่วนแสดงตะกร้าสินค้าในหน้าเว็บ");
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <p>${item.price} บาท x ${item.quantity}</p>
                </div>

                <div class="cart-actions">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                    <button class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        ลบ
                    </button>
                </div>
            </div>
        `).join("");
    }

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
    totalPrice.textContent = total.toLocaleString("th-TH");
}

// สั่งซื้อ
function checkout() {
    if (cart.length === 0) {
        alert("กรุณาเลือกสินค้าในตะกร้าก่อน");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    let orderDetails = cart.map(item =>
        `${item.name} x ${item.quantity} = ${item.price * item.quantity} บาท`
    ).join("\n");

    alert(
        "รายการสั่งซื้อ\n\n" +
        orderDetails +
        "\n\nยอดรวม " + total + " บาท\n\n" +
        "ระบบนี้เป็นตัวอย่าง ยังไม่ได้เชื่อมต่อระบบชำระเงิน"
    );
}

// เริ่มต้นเว็บไซต์
displayProducts();
renderCart();
