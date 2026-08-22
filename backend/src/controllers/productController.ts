import { Request, Response } from 'express';
import slugify from 'slugify';
import Product from '../models/Product';
import Category from '../models/Category';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      make,
      model,
      year,
      inStock,
      featured,
      bestseller,
      sort,
      page = '1',
      limit = '12',
      includeInactive,
    } = req.query;

    const query: any = {};

    // Customer vs Admin view
    if (includeInactive !== 'true') {
      query.active = true;
    }

    // Search term
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex },
        { description: searchRegex },
      ];
    }

    // Category filter by ID or Slug
    if (category) {
      if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: String(category).toLowerCase() });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // No category found, return empty
          res.json({ products: [], total: 0, pages: 0, currentPage: 1 });
          return;
        }
      }
    }

    // Brand filter
    if (brand) {
      query.brand = new RegExp(String(brand), 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured / Bestseller
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;

    // Vehicle compatibility fitment finder
    if (make || model || year) {
      const compElem: any = {};
      if (make) compElem.make = new RegExp(String(make), 'i');
      if (model) compElem.model = new RegExp(String(model), 'i');
      if (year) {
        const yr = Number(year);
        compElem.yearStart = { $lte: yr };
        compElem.yearEnd = { $gte: yr };
      }
      query.compatibility = { $elemMatch: compElem };
    }

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'popular') sortOptions = { numReviews: -1, rating: -1 };

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.max(1, parseInt(String(limit), 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching products' });
  }
};

export const getProductByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug image');
    }

    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() }).populate('category', 'name slug image');
    }

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Related products (from same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      active: true,
    })
      .limit(4)
      .select('name slug price discountPrice images brand rating stock');

    res.json({ product, relatedProducts });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      sku,
      brand,
      category,
      price,
      discountPrice,
      stock,
      description,
      specifications,
      images,
      compatibility,
      featured,
      bestseller,
      active,
    } = req.body;

    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

    const product = new Product({
      name,
      slug,
      sku: sku.toUpperCase(),
      brand,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      description,
      specifications: specifications || [],
      images: images && images.length > 0 ? images : ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'],
      compatibility: compatibility || [],
      featured: featured || false,
      bestseller: bestseller || false,
      active: active !== undefined ? active : true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const {
      name,
      sku,
      brand,
      category,
      price,
      discountPrice,
      stock,
      description,
      specifications,
      images,
      compatibility,
      featured,
      bestseller,
      active,
    } = req.body;

    if (name && name !== product.name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    }

    if (sku) product.sku = sku.toUpperCase();
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (description) product.description = description;
    if (specifications) product.specifications = specifications;
    if (images) product.images = images;
    if (compatibility) product.compatibility = compatibility;
    if (featured !== undefined) product.featured = featured;
    if (bestseller !== undefined) product.bestseller = bestseller;
    if (active !== undefined) product.active = active;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting product' });
  }
};

export const renderProductShareHtml = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop';
    const rawImage = product?.images?.[0] || defaultImage;
    const imageUrl = rawImage.startsWith('http')
      ? rawImage
      : `${req.protocol}://${req.get('host')}${rawImage}`;

    const title = product ? `${product.name} — ${product.brand} ($${product.price})` : 'Apex Motors — Premium Auto Parts & Garage';
    const description = product ? product.description : 'High performance auto parts e-commerce platform and certified master garage workshop.';
    const frontendUrl = process.env.FRONTEND_URL || 'https://apex-motors.netlify.app';
    const targetUrl = product ? `${frontendUrl}/store/product/${product.slug || product._id}` : frontendUrl;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / Telegram -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Apex Motors">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${targetUrl}">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <meta http-equiv="refresh" content="0;url=${targetUrl}">
</head>
<body style="background:#0B0E14;color:#fff;font-family:sans-serif;padding:2rem;">
  <h2>${title}</h2>
  <p>${description}</p>
  <p><a href="${targetUrl}" style="color:#ef4444;">Click here to view product on Apex Motors</a></p>
  <script>window.location.href = "${targetUrl}";</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
