const ADMIN_EMAIL = 'henryperson11@gmail.com';

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> => {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: 'http://localhost:3000',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        _subject: `Apex Motors Contact Inquiry: ${contactData.subject || 'General Inquiry'}`,
        Customer_Name: contactData.name,
        Customer_Email: contactData.email,
        Customer_Phone: contactData.phone || 'Not provided',
        Subject: contactData.subject || 'General Inquiry',
        Message: contactData.message,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    const result = await response.json();
    console.log(`[EmailService] Contact form email sent to ${ADMIN_EMAIL}:`, result);
  } catch (error: any) {
    console.error('[EmailService] Error sending contact email via FormSubmit:', error.message);
  }
};

export const sendOrderNotifications = async (order: {
  orderNumber: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode?: string;
    deliveryInstructions?: string;
  };
  items: Array<{ name: string; sku: string; price: number; quantity: number }>;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
}): Promise<void> => {
  const itemsText = order.items
    .map((item) => `${item.name} (SKU: ${item.sku}) x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  // 1. Email notification to Admin/Shop Email (henryperson11@gmail.com)
  try {
    const responseAdmin = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: 'http://localhost:3000',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        _subject: `🚨 NEW ORDER RECEIVED: ${order.orderNumber} ($${order.total.toFixed(2)})`,
        Order_Number: order.orderNumber,
        Customer_Name: order.customerInfo.fullName,
        Customer_Email: order.customerInfo.email,
        Customer_Phone: order.customerInfo.phone,
        Shipping_Address: `${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.country} ${order.customerInfo.zipCode || ''}`,
        Order_Items: itemsText,
        Subtotal: `$${order.subtotal.toFixed(2)}`,
        Shipping_Fee: `$${order.shippingFee.toFixed(2)}`,
        Tax: `$${order.tax.toFixed(2)}`,
        Total_Amount: `$${order.total.toFixed(2)}`,
        Payment_Method: order.paymentMethod,
        Delivery_Instructions: order.customerInfo.deliveryInstructions || 'None',
        _template: 'table',
        _captcha: 'false',
      }),
    });
    const resultAdmin = await responseAdmin.json();
    console.log(`[EmailService] Admin order notification sent to ${ADMIN_EMAIL}:`, resultAdmin);
  } catch (error: any) {
    console.error('[EmailService] Error sending admin order email:', error.message);
  }

  // 2. Email confirmation to Client/Customer (customerInfo.email)
  if (order.customerInfo.email) {
    try {
      const responseCustomer = await fetch(`https://formsubmit.co/ajax/${order.customerInfo.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Referer: 'http://localhost:3000',
          Origin: 'http://localhost:3000',
        },
        body: JSON.stringify({
          _subject: `✅ Apex Motors Order Confirmation — Order #${order.orderNumber}`,
          Greeting: `Hello ${order.customerInfo.fullName}, thank you for your order at Apex Motors!`,
          Order_Number: order.orderNumber,
          Order_Items: itemsText,
          Total_Paid: `$${order.total.toFixed(2)}`,
          Shipping_Address: `${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.country}`,
          Customer_Support: 'service@apexmotors.com | +1 (800) 555-APEX',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const resultCustomer = await responseCustomer.json();
      console.log(`[EmailService] Customer order confirmation sent to ${order.customerInfo.email}:`, resultCustomer);
    } catch (error: any) {
      console.error('[EmailService] Error sending customer confirmation email:', error.message);
    }
  }
};
