import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendOrderNotifications } from '../services/emailService';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerInfo, items, subtotal, shippingFee, tax, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items specified' });
      return;
    }

    const orderNumber = `APX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : undefined,
      customerInfo,
      items,
      subtotal,
      shippingFee: shippingFee || 0,
      tax: tax || 0,
      total,
      paymentMethod: paymentMethod || 'Card (Stripe Ready)',
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
    });

    // Update stock for purchased products
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const createdOrder = await order.save();

    // Trigger emails via FormSubmit.co to henryperson11@gmail.com and client email
    sendOrderNotifications({
      orderNumber,
      customerInfo,
      items,
      subtotal,
      shippingFee: shippingFee || 0,
      tax: tax || 0,
      total,
      paymentMethod: paymentMethod || 'Card (Stripe Ready)',
    });

    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '15' } = req.query;
    const filter: any = {};

    if (status && status !== 'All') {
      filter.orderStatus = status;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { orderNumber: searchRegex },
        { 'customerInfo.fullName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.max(1, parseInt(String(limit), 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      orders,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching admin orders' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product', 'name slug sku images');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating order' });
  }
};
