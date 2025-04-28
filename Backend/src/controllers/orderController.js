const prisma = require("../db/index.js");
const { OrderStatus } = require("@prisma/client");

const createOrder = async (req, res) => {
  const userId = req.user.userId; // assuming middleware adds this
  const { paymentMethod } = req.body;
  const addressId = parseInt(req.body.addressId); // Convert to integer

  try {
    // 1. Get cart and items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Calculate total amount
    const totalAmount = cart.cartItems.reduce((sum, item) => {
      return sum + item.quantity * (item.price ?? item.product.price);
    }, 0);

    // 3. Create order
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        paymentMethod,
        totalAmount,
        status: OrderStatus.PENDING,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ?? item.product.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // 4. Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Something went wrong during checkout" });
  }
};

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,  // Include user details
        address: true,  // Include address details
        orderItems: {
          include: {
            product: true  // Include product info for each order item
          }
        }
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const getOrderForAdmin = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};


const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;


  try {
    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {status: status.toUpperCase()
      },
    });

    return res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = { createOrder, getAllOrdersForAdmin , updateOrderStatus , getOrderForAdmin };
