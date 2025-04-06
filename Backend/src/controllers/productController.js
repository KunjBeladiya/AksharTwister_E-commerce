const prisma = require("../db/index.js");

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
    res
      .status(200)
      .json({ success: true, message: "All products are retrived", products });
  } catch (erro) {}
};

const addProductToCart = async (req, res) => {
  const productId  = parseInt(req.body.id);
  const userId = req.user.userId;

  try {
    // Step 1: Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    // Step 2: Check if product already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Step 3: If yes, increase quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: 1 },
        },
      });
    } else {
      // Step 4: Fetch product price
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { pricePerKg: true },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Step 5: Add new item with price
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
          price: product.pricePerKg,
        },
      });
    }

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /cart/:clientId - Get all items in a user's cart
const abc = async (req, res) => {
  const { clientId } = req.params;

  try {
    const cart = await prisma.cart.findFirst({
      where: { client_id: parseInt(clientId) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.json(cart.items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProducts, addProductToCart };
