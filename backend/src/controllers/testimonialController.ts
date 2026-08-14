import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const filter: any = {};
    if (includeInactive !== 'true') {
      filter.active = true;
    }
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching testimonials' });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerRole, customerImage, rating, comment, active } = req.body;

    const testimonial = await Testimonial.create({
      customerName,
      customerRole: customerRole || 'Verified Customer',
      customerImage: customerImage || '',
      rating: rating ? Number(rating) : 5,
      comment,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }

    const { customerName, customerRole, customerImage, rating, comment, active } = req.body;
    if (customerName) testimonial.customerName = customerName;
    if (customerRole) testimonial.customerRole = customerRole;
    if (customerImage !== undefined) testimonial.customerImage = customerImage;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (comment) testimonial.comment = comment;
    if (active !== undefined) testimonial.active = active;

    const updated = await testimonial.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting testimonial' });
  }
};
