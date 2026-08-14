import { Request, Response } from 'express';
import slugify from 'slugify';
import Service from '../models/Service';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const filter: any = {};
    if (includeInactive !== 'true') {
      filter.active = true;
    }
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching services' });
  }
};

export const getServiceByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    }
    if (!service) {
      service = await Service.findOne({ slug: id.toLowerCase() });
    }
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }
    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, price, duration, active, featured } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const service = await Service.create({
      name,
      slug,
      description,
      image: image || '/media/life-of-pix-cylinders-569151_1920.jpg',
      price: Number(price),
      duration: duration || '1 - 2 Hours',
      active: active !== undefined ? active : true,
      featured: featured || false,
    });

    res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating service' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    const { name, description, image, price, duration, active, featured } = req.body;
    if (name) {
      service.name = name;
      service.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) service.description = description;
    if (image) service.image = image;
    if (price !== undefined) service.price = Number(price);
    if (duration) service.duration = duration;
    if (active !== undefined) service.active = active;
    if (featured !== undefined) service.featured = featured;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating service' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting service' });
  }
};
