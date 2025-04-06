// Fetch and display products

async function fetchProduct() {
  const response = await fetch("/product");

  const data = await response.json();

  console.log(data.products);
  return data.products;
}

// Function to create a product card dynamically
function createProductCard(product) {
  // Create the main card container

  const container = document.getElementById("product-list");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
        <img src="${product.imageUrl}" alt="Product Image" />
        <div class="details">
          <div class="product-name">${product.name}</div>
          <div class="color">Color : ${product.color}</div>
        </div>
        <div class="special-info">
          ${product.description}
        </div>
        <div class="price-cart">
          <button class="edit" onclick="editProduct('${product.id}')">Edit</button>
          <button class="delete" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      `;

  return card;
}

// Append the created product card to a container

async function loadProducts() {
  document.getElementById("product-list").innerHTML = "";

  const product_data = await fetchProduct();
  console.log(product_data[0].imageUrl);

  console.log(product_data);
  product_data.forEach((product_data) => {
    document
      .getElementById("product-list")
      .appendChild(createProductCard(product_data));
  });
}

/*** add product ***/

function showProductForm() {
  document.getElementById("productFormModal").classList.add("show");
  document.getElementById("overlay").classList.add("show");
}

function hideProductForm() {
  document.getElementById("productFormModal").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}

document
  .getElementById("productForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("color", document.getElementById("color").value);
    formData.append(
      "pricePerKg",
      parseFloat(document.getElementById("price_per_kg").value)
    );
    formData.append("stock", parseInt(document.getElementById("stock").value));
    formData.append(
      "weightOptions",
      document.getElementById("weight_options").value
    );
    formData.append(
      "description",
      document.getElementById("description").value
    );

    const imageFile = document.getElementById("imageFile").files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log(formData);

    try {
      const res = await fetch("/admin/add/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        hideProductForm();
        document.getElementById("productForm").reset();
        // Optionally refresh product list
        // fetchProducts();
        const card = createProductCard(data.product); // or newProduct if directly returned
        document.getElementById("product-list").appendChild(card);
      } else {
        const error = await res.json();
        console.log("error in response", error);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  });

document.getElementById("imageFile").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("imagePreview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

/***   delete product  ****/

async function deleteProduct(product_id) {
  try {
    const response = await fetch(`/admin/delete/products/${product_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove product card from DOM
      const button = document.querySelector(
        `button.delete[onclick="deleteProduct('${product_id}')"]`
      );
      const card = button.closest(".card");
      card.remove();
    } else {
      console.log("Failed to delete product");
    }
  } catch (error) {
    console.log("error in delete product", error);
  }
}
