const prisma = require("../db/index.js");

const viewCart = async (req, res) => {
  const userId = req.user.userId; // from JWT

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const cartItems = cart.cartItems.map((item) => {
      const itemTotal = item.price
        ? Number(item.price) * item.quantity
        : item.product.price_per_kg * item.quantity;

      return {
        itemId: item.id,
        productId: item.productId,
        name: item.product.name,
        color: item.product.color,
        pricePerKg: Number(item.price || item.product.price_per_kg),
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        total: itemTotal,
      };
    });

    const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);

    res.json({
      cartId: cart.id,
      items: cartItems,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCartProduct = async (req, res) => {
  console.log(req.body.itemId);
  const { itemId, action } = req.body;
  const userId = req.user.userId;

  if (!itemId || !["increment", "decrement"].includes(action)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId: userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) return res.status(404).json({ error: "Item not found" });

    let newQty = cartItem.quantity;
    if (action === "increment") newQty += 1;
    else if (action === "decrement" && cartItem.quantity > 1) newQty -= 1;

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQty },
    });

    // Fetch updated cart
    const updatedCart = await prisma.cartItem.findMany({
      where: {
        cart: {
          userId: userId,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        id: "asc", // Or any field you know exists, like id or quantity
      },
    });

    const items = updatedCart.map((item) => ({
      id: item.id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      pricePerKg: item.product.pricePerKg,
      quantity: item.quantity,
      total: item.quantity * item.product.pricePerKg,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    res.json({ items, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCartProduct = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.userId;

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parseInt(itemId), cart: { userId } },
    });

    if (!cartItem) return res.status(404).json({ error: "Item not found" });

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};

module.exports = { viewCart, updateCartProduct , deleteCartProduct };
