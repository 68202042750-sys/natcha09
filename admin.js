const ADMIN_PASSWORD = "68202042750";
const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("admin-dashboard");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const productForm = document.getElementById("product-form");
const productMessage = document.getElementById("product-message");
const productList = document.getElementById("admin-product-list");
const formTitle = document.getElementById("product-form-title");
const cancelEditButton = document.getElementById("cancel-edit-button");
const productNameInput = document.getElementById("product-name");
const productImageInput = document.getElementById("product-image");
const productImageFileInput = document.getElementById("product-image-file");
const imagePreview = document.getElementById("product-image-preview");
const imageSuggestionMessage = document.getElementById("image-suggestion-message");
let products = FreshDrinkCatalog.read();
let editingProductId = null;
let selectedImageData = "";

productNameInput.addEventListener("input", () => {
    const suggestion = suggestImage(productNameInput.value);
    selectedImageData = "";
    productImageFileInput.value = "";
    productImageInput.value = suggestion.image;
    imageSuggestionMessage.textContent = suggestion.matched
        ? "เลือกรูปให้ตามชื่อเครื่องดื่มแล้ว สามารถเปลี่ยนลิงก์รูปได้"
        : "ไม่พบชนิดเครื่องดื่มที่ตรง ใช้ภาพเครื่องดื่มทั่วไป สามารถเปลี่ยนลิงก์รูปได้";
    updateImagePreview();
});

productImageInput.addEventListener("input", () => {
    selectedImageData = "";
    productImageFileInput.value = "";
    updateImagePreview();
});

productImageFileInput.addEventListener("change", async () => {
    const file = productImageFileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        productMessage.textContent = "กรุณาเลือกไฟล์รูปภาพ";
        productImageFileInput.value = "";
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        productMessage.textContent = "ไฟล์รูปต้องมีขนาดไม่เกิน 10 MB";
        productImageFileInput.value = "";
        return;
    }

    try {
        selectedImageData = await optimizeImage(file);
        productImageInput.value = "";
        updateImagePreview(selectedImageData);
        imageSuggestionMessage.textContent = `เลือกรูป "${file.name}" แล้ว`;
        productMessage.textContent = "";
    } catch (error) {
        productMessage.textContent = `อ่านไฟล์รูปไม่สำเร็จ: ${error.message}`;
        productImageFileInput.value = "";
    }
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const enteredPassword = document.getElementById("admin-password").value;

    if (enteredPassword !== ADMIN_PASSWORD) {
        loginMessage.textContent = "รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง";
        return;
    }

    loginMessage.textContent = "";
    loginForm.reset();
    loginPanel.hidden = true;
    dashboard.hidden = false;
    renderProducts();
});

document.getElementById("logout-button").addEventListener("click", () => {
    dashboard.hidden = true;
    loginPanel.hidden = false;
    resetProductForm();
});

productForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const name = String(formData.get("name")).trim();
    const price = Number(formData.get("price"));
    const image = selectedImageData || String(formData.get("image")).trim() || suggestImage(name).image;

    if (!name || !Number.isFinite(price) || price < 0) {
        productMessage.textContent = "กรุณากรอกชื่อเมนูและราคาที่ถูกต้อง";
        return;
    }

    let imageValue = image;
    const isProjectImage = /^images\/[a-z0-9._-]+$/i.test(image);
    if (!isProjectImage && !image.startsWith("data:image/jpeg;base64,")) {
        let imageUrl;
        try {
            imageUrl = new URL(image);
        } catch {
            productMessage.textContent = "กรุณาเลือกไฟล์รูปหรือใส่ลิงก์รูปภาพที่ถูกต้อง";
            return;
        }

        if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") {
            productMessage.textContent = "ลิงก์รูปภาพต้องขึ้นต้นด้วย http:// หรือ https://";
            return;
        }
        imageValue = imageUrl.href;
    }

    let updatedProducts;
    if (editingProductId === null) {
        const nextId = products.reduce((largestId, product) =>
            Math.max(largestId, product.id), 0
        ) + 1;
        updatedProducts = [...products, { id: nextId, name, price, image: imageValue }];
    } else {
        updatedProducts = products.map(product => product.id === editingProductId
            ? { ...product, name, price, image: imageValue }
            : product
        );
    }

    try {
        FreshDrinkCatalog.write(updatedProducts);
    } catch (error) {
        productMessage.textContent = error.name === "QuotaExceededError"
            ? "พื้นที่จัดเก็บเต็ม ลองเลือกรูปที่มีขนาดเล็กลง"
            : `บันทึกเมนูไม่สำเร็จ: ${error.message}`;
        return;
    }

    products = updatedProducts;
    renderProducts();
    productMessage.textContent = editingProductId === null
        ? "เพิ่มเมนูเรียบร้อยแล้ว"
        : "บันทึกการแก้ไขเรียบร้อยแล้ว";
    resetProductForm(false);
});

cancelEditButton.addEventListener("click", () => resetProductForm());

function renderProducts() {
    if (products.length === 0) {
        productList.innerHTML = '<p class="empty-cart">ยังไม่มีเมนู เพิ่มเมนูแรกได้จากแบบฟอร์ม</p>';
        return;
    }

    productList.innerHTML = products.map(product => `
        <article class="admin-product">
            <img src="${FreshDrinkCatalog.escapeHtml(product.image)}" alt="${FreshDrinkCatalog.escapeHtml(product.name)}">
            <div class="admin-product-details">
                <strong>${FreshDrinkCatalog.escapeHtml(product.name)}</strong>
                <span>${product.price.toLocaleString("th-TH")} บาท</span>
            </div>
            <div class="admin-product-actions">
                <button class="admin-secondary-btn" type="button" data-edit="${product.id}">แก้ไข</button>
                <button class="admin-delete-btn" type="button" data-delete="${product.id}">ลบ</button>
            </div>
        </article>
    `).join("");
}

productList.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    const editId = Number(button.dataset.edit);
    const deleteId = Number(button.dataset.delete);

    if (button.dataset.edit !== undefined) {
        startEditing(editId);
    } else if (button.dataset.delete !== undefined) {
        deleteProduct(deleteId);
    }
});

function startEditing(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    editingProductId = id;
    productForm.elements.name.value = product.name;
    productForm.elements.price.value = product.price;
    selectedImageData = product.image.startsWith("data:image/jpeg;base64,")
        ? product.image
        : "";
    productImageInput.value = selectedImageData ? "" : product.image;
    productImageFileInput.value = "";
    updateImagePreview(selectedImageData || productImageInput.value);
    imageSuggestionMessage.textContent = selectedImageData
        ? "ใช้รูปจากไฟล์ที่เลือกไว้ หรือเลือกรูปใหม่"
        : "แก้ไขชื่อเมนูเพื่อเลือกรูปอัตโนมัติ หรือใส่ลิงก์รูปเอง";
    formTitle.textContent = "แก้ไขเมนู";
    cancelEditButton.hidden = false;
    productMessage.textContent = "";
    document.getElementById("product-name").focus();
}

function deleteProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product || !window.confirm(`ต้องการลบเมนู "${product.name}" หรือไม่?`)) return;

    const updatedProducts = products.filter(item => item.id !== id);
    try {
        FreshDrinkCatalog.write(updatedProducts);
    } catch (error) {
        productMessage.textContent = `ลบเมนูไม่สำเร็จ: ${error.message}`;
        return;
    }
    products = updatedProducts;
    renderProducts();

    if (editingProductId === id) {
        resetProductForm();
    }
    productMessage.textContent = "ลบเมนูเรียบร้อยแล้ว";
}

function resetProductForm(clearMessage = true) {
    productForm.reset();
    selectedImageData = "";
    productImageFileInput.value = "";
    imagePreview.removeAttribute("src");
    imageSuggestionMessage.textContent = "พิมพ์ชื่อเมนูเพื่อเลือกรูปให้ตรงกับเครื่องดื่ม";
    editingProductId = null;
    formTitle.textContent = "เพิ่มเมนูใหม่";
    cancelEditButton.hidden = true;
    if (clearMessage) {
        productMessage.textContent = "";
    }
}

function suggestImage(name) {
    const normalizedName = name.trim().toLocaleLowerCase("th-TH");
    const suggestions = [
        { pattern: /มัทฉะ|ชาเขียว|matcha|green\s*tea/, id: 2 },
        { pattern: /ชาไทย|ชาเย็น|thai\s*tea/, id: 1 },
        { pattern: /นมชมพู|pink\s*milk/, id: 3 },
        { pattern: /กาแฟ|เอสเพรสโซ|ลาเต้|coffee|espresso|latte/, id: 4 },
        { pattern: /โกโก้มิ้นต์|mint\s*cocoa|mint\s*chocolate/, id: 14 },
        { pattern: /โกโก้|ช็อกโกแลต|cocoa|cacao|chocolate/, id: 5 },
        { pattern: /บลูฮาวาย|blue\s*hawaii/, id: 18 },
        { pattern: /ชามะนาว|lemon\s*tea/, id: 10 },
        { pattern: /น้ำส้ม|ส้ม|orange|juice/, id: 6 },
        { pattern: /สตรอว์เบอร์รี|สตรอเบอร์รี|สตรอว์เบอรี่|สตรอเบอรี่|strawberry|berry/, id: 7 },
        { pattern: /มะนาว|เลมอน|lime|lemon/, id: 8 },
        { pattern: /ชานม|ไข่มุก|bubble\s*tea|milk\s*tea/, id: 1 },
        { pattern: /ชา|tea/, id: 1 },
        { pattern: /นม|milk/, id: 3 }
    ];
    const match = suggestions.find(item => item.pattern.test(normalizedName));
    const product = FreshDrinkCatalog.defaults.find(item => item.id === (match ? match.id : 7));

    return {
        image: product.image,
        matched: Boolean(match)
    };
}

function updateImagePreview(selectedImage = "") {
    const image = selectedImage || productImageInput.value.trim();
    if (image) {
        imagePreview.src = image;
    } else {
        imagePreview.removeAttribute("src");
    }
}

function optimizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์ได้"));
        reader.onload = () => {
            const image = new Image();
            image.onerror = () => reject(new Error("ไฟล์รูปภาพไม่ถูกต้อง"));
            image.onload = () => {
                const maxDimension = 1000;
                const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);
                const context = canvas.getContext("2d");
                if (!context) {
                    reject(new Error("เบราว์เซอร์ไม่สามารถประมวลผลรูปภาพได้"));
                    return;
                }

                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

updateImagePreview();
