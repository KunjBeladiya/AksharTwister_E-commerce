function createProductCard(product) {
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
        <div class="price-box">₹ ${product.pricePerKg} / kg</div>
        <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `;

  return card;
}

async function fetchProduct() {
  try {
    const response = await fetch("/product");
    const data = await response.json(); // 🛠️ await added here
    return data.products; // assuming your API returns { product: [...] }
  } catch (error) {
    console.log("Error in product fetch", error);
    return []; // fallback to empty array
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProduct();
  console.log(products);

  const container = document.getElementById("product-container");
  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
});

async function addToCart(id) {
  try {
    const response = await fetch("/product/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Product added to cart!");
    } else {
      alert(result.message || "Failed to add to cart.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Something went wrong.");
  }
}

document.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (scrollY > 100) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
});

window.addEventListener("load", async (event) => {
  try {
    const response = await fetch("/user/checkAuth", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      document
        .getElementById("profilebtn")
        .classList.remove("hidden", "skeleton");
      document.getElementById("cartbtn").classList.remove("hidden", "skeleton");
    } else {
      document
        .getElementById("signupbtn")
        .classList.remove("hidden", "skeleton");
      document
        .getElementById("loginbtn")
        .classList.remove("hidden", "skeleton");
    }
  } catch (error) {
    console.log("error in homepage loading : ", error);
  }
});
