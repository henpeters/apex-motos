import { Request, Response } from 'express';
import slugify from 'slugify';
import Category from '../models/Category';
import Product from '../models/Product';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const filter: any = {};
    if (includeInactive !== 'true') {
      filter.active = true;
    }

    const categories = await Category.find(filter).sort({ name: 1 });

    // Calculate product counts for each category dynamically
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const itemCount = await Product.countDocuments({ category: cat._id, active: true });
        return {
          ...cat.toObject(),
          itemCount,
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching categories' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    const itemCount = await Product.countDocuments({ category: category._id, active: true });
    res.json({ ...category.toObject(), itemCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, active } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      res.status(400).json({ message: 'Category with this name already exists' });
      return;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '/media/barni1-automobile-679874_1920.jpg',
      active: active !== undefined ? active : true,
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const { name, description, image, active } = req.body;
    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (active !== undefined) category.active = active;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if products exist in category
    const productsInCat = await Product.countDocuments({ category: id });
    if (productsInCat > 0) {
      res.status(400).json({ message: `Cannot delete category: ${productsInCat} products are assigned to it` });
      return;
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting category' });
  }
};
