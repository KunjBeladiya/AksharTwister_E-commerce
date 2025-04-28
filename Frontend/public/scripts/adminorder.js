// Fetch and display orders (active, pending, complete)
function loadOrders() {
  console.log("order");
  fetchAllOrders();
}

// Fetch all orders from the backend
async function fetchAllOrders() {
  try {
    const response = await fetch("/order/view");
    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Render orders in the table
function renderOrders(orders) {
  const ordersTable = document.querySelector(".orders-table tbody");
  ordersTable.innerHTML = ""; // Clear any existing rows

  orders.forEach((order) => {
    const row = document.createElement("tr");

    const orderIdCell = document.createElement("td");
    orderIdCell.textContent = order.id;
    row.appendChild(orderIdCell);

    const statusCell = document.createElement("td");
    const statusSelect = document.createElement("select");
    const statuses = ["Pending", "Processing", "Completed", "Canceled"]; // Add your statuses here

    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (status === order.status) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    });

    // When the status is changed, update the order status
    statusSelect.onchange = async () => {
      await updateOrderStatus(order.id, statusSelect.value);
    };

    statusCell.appendChild(statusSelect);
    row.appendChild(statusCell);

    const userCell = document.createElement("td");
    userCell.textContent = `${order.user.name} (${order.user.email})`;
    row.appendChild(userCell);

    const addressCell = document.createElement("td");
    addressCell.textContent = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}`;
    row.appendChild(addressCell);

    const actionCell = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.classList.add("order-view-btn");
    viewButton.textContent = "View Details";
    viewButton.onclick = () => toggleOrderDetails(order.id);
    actionCell.appendChild(viewButton);
    row.appendChild(actionCell);

    // Add row to table
    ordersTable.appendChild(row);

    // Create a div for the order details
    const orderDetailsDiv = document.createElement("div");
    orderDetailsDiv.id = `orderDetails_${order.id}`;
    orderDetailsDiv.classList.add("order-details");
    orderDetailsDiv.innerHTML = `
        <h3>Order Details</h3>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>User:</strong> ${order.user.name} (${order.user.email})</p>
        <p><strong>Address:</strong> ${order.address.street}, ${
      order.address.city
    }, ${order.address.state}, ${order.address.zipcode}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
        <h4>Order Items</h4>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) => `
              <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;

    // Add order details div below the current order row
    ordersTable.appendChild(orderDetailsDiv);
  });
}

// Function to toggle the visibility of the order details
function toggleOrderDetails(orderId) {
  const orderDetailsDiv = document.getElementById(`orderDetails_${orderId}`);
  if (orderDetailsDiv.style.display === "none") {
    orderDetailsDiv.style.display = "block"; // Show details
  } else {
    orderDetailsDiv.style.display = "none"; // Hide details
  }
}

// Update the order status when the admin changes the dropdown selection
async function updateOrderStatus(orderId, newStatus) {
    console.log(orderId);
  try {
    const response = await fetch(`/order/updateOrder/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Order status updated:", result);
    } else {
      console.error("Failed to update order status:", result.message);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}



