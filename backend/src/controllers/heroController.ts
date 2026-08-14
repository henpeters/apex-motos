import { Request, Response } from 'express';
import HeroSlide from '../models/HeroSlide';

export const getHeroSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const filter: any = {};
    if (includeInactive !== 'true') {
      filter.active = true;
    }
    const slides = await HeroSlide.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching hero slides' });
  }
};

export const createHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, image, video, buttonText, buttonLink, active, order } = req.body;

    const slide = await HeroSlide.create({
      title,
      subtitle,
      image,
      video: video || '',
      buttonText: buttonText || 'Shop Parts',
      buttonLink: buttonLink || '/store',
      active: active !== undefined ? active : true,
      order: order ? Number(order) : 0,
    });

    res.status(201).json(slide);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating hero slide' });
  }
};

export const updateHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      res.status(404).json({ message: 'Hero slide not found' });
      return;
    }

    const { title, subtitle, image, video, buttonText, buttonLink, active, order } = req.body;
    if (title) slide.title = title;
    if (subtitle) slide.subtitle = subtitle;
    if (image) slide.image = image;
    if (video !== undefined) slide.video = video;
    if (buttonText) slide.buttonText = buttonText;
    if (buttonLink) slide.buttonLink = buttonLink;
    if (active !== undefined) slide.active = active;
    if (order !== undefined) slide.order = Number(order);

    const updated = await slide.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating hero slide' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByIdAndDelete(id);

    if (!slide) {
      res.status(404).json({ message: 'Hero slide not found' });
      return;
    }

    res.json({ message: 'Hero slide deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting hero slide' });
  }
};
