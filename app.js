
addProduct = () => {
    let productName = document.getElementById("productName");
    let productPrice = document.getElementById("productPrice");
    let productImg = document.getElementById("productImg");
    let productCategory = document.getElementById("productCategory");
    let productDescription = document.getElementById("productDescription");

    if (!productName.value || !productPrice.value || !productImg.value || !productCategory.value || !productDescription.value) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
        return;
    }
    if (productName.value.length < 3 || productName.value.length > 50) {
        alert("Tên sản phẩm phải có độ dài từ 3 đến 50 ký tự.");
        return;
    }

    let newProduct = {
        name: productName.value,
        category: productCategory.value,
        price: productPrice.value,
        image: productImg.value,
        description: productDescription.value
    };

    axios.post("http://localhost:3000/products", newProduct)
        .then(res => {
            loadData();
            productName.value = "";
            productPrice.value = "";
            productImg.value = "";
            productCategory.value = "";
            productDescription.value = "";
        });
}


let editID = -1
editProduct = (id) => {
    editID = id
    axios.get(`http://localhost:3000/products/${id}`)
        .then(res => {
            document.getElementById("editName").value = res.data.name
            document.getElementById("editPrice").value = res.data.price
            document.getElementById("editImg").value = res.data.image
            document.getElementById("editCategory").value = res.data.category
            document.getElementById("editDescription").value = res.data.description
        })
}
updateProduct = () => {
    let editName = document.getElementById("editName")
    let editPrice = document.getElementById("editPrice")
    let editImg = document.getElementById("editImg")
    let editCategory = document.getElementById("editCategory")
    let editDescription = document.getElementById("editDescription")
    if (!editName.value || !editPrice.value) {
        alert("Vui lòng nhập đầy đủ thông tin")
        return
    }
    if (editID == -1) return
    let updateProduct = {
        name: editName.value,
        price: editPrice.value,
        image: editImg.value,
        category: editCategory.value,
        description: editDescription.value
    }
    axios.put(`http://localhost:3000/products/${editID}`, updateProduct)
        .then(res => {
            showProducts()
        })
}


deleteProduct = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        axios.delete(`http://localhost:3000/products/${id}`)
            .then(res => {
                showProducts()
            })
    }
}
// Category
addCategory = () => {
    let categoryId = document.getElementById("categoryId").value.trim();
    let categoryName = document.getElementById("categoryName").value.trim();

    if (categoryId === "" || categoryName === "") {
        alert("Vui lòng điền đầy đủ thông tin danh mục.");
        return;
    }

    let newCategory = {
        id: categoryId,
        name: categoryName
    };

    axios.post("http://localhost:3000/categories", newCategory)
        .then(res => {
            showCategories();
            document.getElementById("categoryId").value = "";
            document.getElementById("categoryName").value = "";
        });
}
let editIDCate = -1
editCategory = (id) => {
    editIDCate = id
    axios.get(`http://localhost:3000/categories/${id}`)
        .then(res => {
            document.getElementById("editCateId").value = res.data.id
            document.getElementById("editCateName").value = res.data.name
        })
}

updateCategory = (id) => {
    let editCateId = document.getElementById("editCateId")
    let editCateName = document.getElementById("editCateName")
    if (!editCateId.value || !editCateName.value) {
        alert("Vui lòng nhập đầy đủ thông tin")
        return
    }
    if (editIDCate == -1) return
    let updateCategory = {
        id: editCateId.value,
        name: editCateName.value
    }
    axios.put(`http://localhost:3000/categories/${editIDCate}`, updateCategory)
        .then(res => {
            showCategories()
        })
}


deleteCategory = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
        axios.delete(`http://localhost:3000/categories/${id}`)
            .then(res => {
                showCategories();
            });
    }
}


formatCurrency = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


render = (data) => {
    let htmlString = `
        <table class="table">
            <tr>
                <th>ID sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Hành động</th>
            </tr>`
    data.forEach(product => {
        htmlString += `
        <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td><img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px;"></td>
        <td>${product.category}</td>
        <td>${formatCurrency(Number(product.price))}</td>
        <td>${product.description}</td>
        <td><button class="btn btn-warning" onclick="editProduct('${product.id}')" data-bs-toggle="modal" data-bs-target="#myModal">Sửa</button></td>
        <td><button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Xóa</button></td>
    </tr>
    `
    });
    htmlString += `</table>`
    document.getElementById("showSP").innerHTML = htmlString
}
showProducts = () => {
    axios.get("http://localhost:3000/products")
        .then(res => {
            render(res.data)
        })
}
showProducts()

/* show cate */
renderCate = (categories) => {
    let htmlString = `
        <table class="table">
            <tr>
                <th>ID danh mục</th>
                <th>Tên danh mục</th>
                <th>Hành động</th>
            </tr>`;
    categories.forEach(category => {
        htmlString += `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#myModal-3" onclick="editCategory('${category.id}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteCategory('${category.id}')">Xóa</button>
                </td>
            </tr>`;
    });
    htmlString += `</table>`;
    document.getElementById("showCategories").innerHTML = htmlString;
};

showCategories = () => {
    axios.get("http://localhost:3000/categories")
        .then(res => {
            renderCate(res.data); // Giả sử dữ liệu trả về là một mảng các danh mục trực tiếp
        })
};
showCategories();


// product index
showProductsIndex = () => {
    let productIndexElement = document.getElementById('productIndex');
    axios.get("http://localhost:3000/products")
        .then(res => {
            const products = res.data.slice(0, 4);
            let htmlString = '';

            products.forEach(product => {
                htmlString += `
                    <div class="product-card">
                        <h3>${product.name}</h3>
                        <img onclick="window.location.href = 'detail.html?id=${product.id}'" src="${product.image}" alt="${product.name}" width="100">
                        <p>Danh mục: ${product.category}</p>
                        <p>${formatCurrency(Number(product.price))}</p>
                        <button class="btn btn-success">Mua ngay</button>
                        <a href="detail.html?id=${product.id}"><button class="btn btn-success" >Xem chi tiết</button></a>
                    </div>`;
            });
            productIndexElement.innerHTML = htmlString;
        });
}
showProductsIndex()

// product sale
showProductsIndexSale = () => {
    let productIndexElement = document.getElementById('productIndexSale');
    axios.get("http://localhost:3000/products")
        .then(res => {
            const products = res.data.filter(product => product.hasOwnProperty('price-discount'));
            let htmlString = '';

            products.forEach(product => {
                const price = Number(product.price);
                const discountPrice = Number(product['price-discount']);
                htmlString += `
                    <div class="product-card">
                        <h3>${product.name}</h3>
                        <img onclick="window.location.href = 'detail.html?id=${product.id}'" src="${product.image}" alt="${product.name}" width="100">
                        <p>Danh mục: ${product.category}</p>
                        <p>Giá gốc: ${formatCurrency(price)}</p>
                        <p class="red-text">Giá hiện tại: ${formatCurrency(discountPrice)}</p>
                        <button class="btn btn-success">Mua ngay</button>
                        <a href="detail.html?id=${product.id}"><button class="btn btn-success" >Xem chi tiết</button></a>
                    </div>`;
            });


            productIndexElement.innerHTML = htmlString;
        });
}

// Gọi hàm để hiển thị sản phẩm có giá giảm
showProductsIndexSale();

// all products
renderAllProduct = (data) => {
    let htmlString = '';
    data.forEach(product => {
        htmlString += `
        <div class="product-card">
            <h3>${product.name}</h3>
            <img onclick="window.location.href = 'detail.html?id=${product.id}'" src="${product.image}" alt="${product.name}" width="100">
            <p>Danh mục: ${product.category}</p>
            <p>${formatCurrency(Number(product.price))}</p>
            <a href="detail.html?id=${product.id}"><button class="btn btn-success" >Xem chi tiết</button></a>
        </div>`;
    });
    document.getElementById("allproduct").innerHTML = htmlString;
};

showAllProduct = () => {
    axios.get("http://localhost:3000/products")
        .then(res => {
            products = res.data; // Cập nhật biến products với dữ liệu mới
            renderAllProduct(products);
        })
}
showAllProduct();





searchProduct = (e) => {
    let search = document.querySelector("#search")
    if (e.key == "Enter") {
        search.value = ""
    }
    axios.get("http://localhost:3000/products")
        .then(res => {
            products = res.data.filter(product => product.name.toLowerCase().includes(search.value.toLowerCase()))
            render(products)
        })
}
searchProductHome = (e) => {
    let searchHome = document.getElementById('searchProductHome')

    if (e.key == "enter") {
        searchHome.value = ""
    }
    axios.get("http://localhost:3000/products")
        .then(res => {
            products = res.data.filter(product => product.name.toLowerCase().includes(searchHome.value.toLowerCase()))
            renderAllProduct(products)
        });
}

// sắp xếp theo giá
let products = [];
const sortProductsByPrice = (order) => {
    if (order === 'asc') {
        products.sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
        products.sort((a, b) => b.price - a.price);
    }
    renderAllProduct(products);
};

// Bắt sự kiện khi người dùng nhấn nút sắp xếp
const sortAscButton = document.getElementById('sortAscButton');
const sortDescButton = document.getElementById('sortDescButton');

sortAscButton.addEventListener('click', () => {
    sortProductsByPrice('asc');
});

sortDescButton.addEventListener('click', () => {
    sortProductsByPrice('desc');
});