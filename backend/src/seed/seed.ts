import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Service from '../models/Service';
import Testimonial from '../models/Testimonial';
import HeroSlide from '../models/HeroSlide';
import { connectDB } from '../config/db';

const categoriesData = [
  { name: 'Engine Parts', slug: 'engine-parts', description: 'Pistons, valves, timing kits, and high-performance engine components', image: '/media/life-of-pix-cylinders-569151_1920.jpg' },
  { name: 'Brake Systems', slug: 'brake-systems', description: 'Performance ceramic pads, slotted rotors, and hydraulic calipers', image: '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg' },
  { name: 'Suspension & Steering', slug: 'suspension-steering', description: 'Coilovers, struts, control arms, sway bars, and tie rods', image: '/media/pineapple22productions-wheel-4640912_1920.jpg' },
  { name: 'Electrical & Ignition', slug: 'electrical-ignition', description: 'High-output alternators, starters, coils, spark plugs, and sensors', image: '/media/olarts-caps-1937013_1920.jpg' },
  { name: 'Lighting & Electronics', slug: 'lighting-electronics', description: 'LED headlight assemblies, fog lights, tail lamps, and modules', image: '/media/dayronv-nissan-885309_1920.jpg' },
  { name: 'Wheels & Tires', slug: 'wheels-tires', description: 'Forged alloy wheels, performance tires, and pressure sensors', image: '/media/pineapple22productions-wheel-4640912_1920.jpg' },
  { name: 'Body Parts & Trim', slug: 'body-parts-trim', description: 'Bumpers, carbon fiber diffusers, side skirts, and mirrors', image: '/media/gahsh-cars-975634_1920.jpg' },
  { name: 'Transmission & Drivetrain', slug: 'transmission-drivetrain', description: 'Heavy-duty clutches, flywheels, CV axles, and gear fluids', image: '/media/mimzy-clutch-2755548_1920.jpg' },
  { name: 'Cooling & Heating', slug: 'cooling-heating', description: 'Aluminum radiators, water pumps, thermostats, and intercoolers', image: '/media/life-of-pix-cylinders-569151_1920.jpg' },
  { name: 'Exhaust Systems', slug: 'exhaust-systems', description: 'Stainless cat-back exhausts, headers, and catalytic converters', image: '/media/paulbr75-automotive-3052297_1920.jpg' },
  { name: 'Filters & Maintenance', slug: 'filters-maintenance', description: 'High-flow oil filters, cabin air filters, and fuel filters', image: '/media/olarts-caps-1937013_1920.jpg' },
  { name: 'Lubricants & Fluids', slug: 'lubricants-fluids', description: 'Full synthetic engine oil, brake fluid, coolant, and gear oil', image: '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg' },
  { name: 'Interior Accessories', slug: 'interior-accessories', description: 'Custom floor mats, racing seats, steering wheels, and trim', image: '/media/schwarzenarzisse-antique-car-365354_1920.jpg' },
  { name: 'Performance Upgrades', slug: 'performance-upgrades', description: 'Turbochargers, superchargers, cold air intakes, and ECUs', image: '/media/barni1-automobile-679874_1920.jpg' },
  { name: 'Garage Tools & Equipment', slug: 'garage-tools-equipment', description: 'OBD2 diagnostic scanners, hydraulic jacks, torque wrenches, and lifts', image: '/media/paulbr75-automotive-3052297_1920.jpg' },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Clearing existing collections...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await HeroSlide.deleteMany({});

    // 1. Create Admin User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Apex Garage Director',
      email: 'admin@apexmotors.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+1 (800) 555-APEX',
      address: {
        street: '100 Performance Way',
        city: 'Motor City',
        state: 'MI',
        zip: '48201',
        country: 'United States',
      },
    });
    console.log(`[Seed] Admin User created: ${adminUser.email} / admin123`);

    // Create a Sample Customer User
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    await User.create({
      name: 'Marcus Vance',
      email: 'customer@apexmotors.com',
      password: customerPasswordHash,
      role: 'customer',
      phone: '+1 (555) 019-2834',
    });

    // 2. Create 15 Categories
    const categoriesMap: { [slug: string]: string } = {};
    for (const catData of categoriesData) {
      const cat = await Category.create(catData);
      categoriesMap[catData.slug] = cat._id.toString();
    }
    console.log(`[Seed] ${Object.keys(categoriesMap).length} Categories created.`);

    // 3. Create 30 Realistic Automotive Products
    const productsData = [
      // Brake Systems
      {
        name: 'Brembo GT-R 6-Piston High Performance Front Brake Kit',
        sku: 'BRM-GTR-601',
        brand: 'Brembo',
        categorySlug: 'brake-systems',
        price: 1850.0,
        discountPrice: 1699.99,
        stock: 14,
        description: 'Engineered for extreme track day stopping power and high-speed thermal dissipation. Features forged monoblock aluminum calipers and 380mm slotted 2-piece floating rotors.',
        specifications: [
          { key: 'Caliper Type', value: 'Forged Monoblock 6-Piston' },
          { key: 'Rotor Diameter', value: '380mm (15 Inches)' },
          { key: 'Material', value: 'High Carbon Cast Iron & Billet Aluminum' },
          { key: 'Pads Included', value: 'Ceramic Composite Race Spec' },
        ],
        images: ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg', '/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [
          { make: 'BMW', model: 'M3 / M4 (F80 / F82)', yearStart: 2015, yearEnd: 2020 },
          { make: 'Porsche', model: '911 Carrera (991)', yearStart: 2012, yearEnd: 2019 },
        ],
        featured: true,
        bestseller: true,
      },
      {
        name: 'Akebono ProACT Ultra-Premium Ceramic Front Brake Pads',
        sku: 'AKE-ACT-1089',
        brand: 'Akebono',
        categorySlug: 'brake-systems',
        price: 89.99,
        discountPrice: 74.50,
        stock: 45,
        description: 'OE-quality ceramic formulation designed for silent braking, virtually zero brake dust, and extended rotor life under normal and spirited street driving.',
        specifications: [
          { key: 'Material', value: 'Ultra-Premium Ceramic' },
          { key: 'Position', value: 'Front Axle' },
          { key: 'Hardware Kit', value: 'Included Stainless Steel Shims' },
        ],
        images: ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'],
        compatibility: [
          { make: 'Toyota', model: 'Camry', yearStart: 2018, yearEnd: 2024 },
          { make: 'Toyota', model: 'RAV4', yearStart: 2019, yearEnd: 2024 },
          { make: 'Lexus', model: 'ES350', yearStart: 2019, yearEnd: 2023 },
        ],
        featured: false,
        bestseller: true,
      },
      {
        name: 'EBC Brakes USR Slotted Front Brake Rotors Pair',
        sku: 'EBC-USR-742',
        brand: 'EBC Brakes',
        categorySlug: 'brake-systems',
        price: 245.00,
        discountPrice: 219.00,
        stock: 18,
        description: 'Super-silent slotted brake rotors with Black Geomet anti-corrosion coating. Designed to continuously sweep away dust and gases for consistent pedal feel.',
        specifications: [
          { key: 'Rotor Style', value: 'Narrow Slot Profile' },
          { key: 'Coating', value: 'Geomet Black Anti-Rust' },
          { key: 'Quantity', value: 'Pair (Left & Right)' },
        ],
        images: ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'],
        compatibility: [
          { make: 'Honda', model: 'Civic Type R (FK8)', yearStart: 2017, yearEnd: 2021 },
          { make: 'Subaru', model: 'WRX STI', yearStart: 2015, yearEnd: 2021 },
        ],
        featured: false,
        bestseller: false,
      },

      // Engine Parts
      {
        name: 'Mahle Motorsport Forged Racing Piston Kit',
        sku: 'MHL-PST-9400',
        brand: 'Mahle',
        categorySlug: 'engine-parts',
        price: 950.00,
        discountPrice: 890.00,
        stock: 8,
        description: 'Low-expansion 4032 forged aluminum alloy pistons engineered for boosted applications up to 800+ HP. Includes phosphate dry-film lubricant coating on skirts.',
        specifications: [
          { key: 'Bore Size', value: '85.5mm Standard' },
          { key: 'Compression Ratio', value: '9.5:1 Turbo Spec' },
          { key: 'Pin Size', value: '22mm Heavy Duty' },
        ],
        images: ['/media/life-of-pix-cylinders-569151_1920.jpg'],
        compatibility: [
          { make: 'Audi', model: 'S3 / TTS (2.0 TSI EA888)', yearStart: 2015, yearEnd: 2022 },
          { make: 'Volkswagen', model: 'Golf R Mk7', yearStart: 2015, yearEnd: 2021 },
        ],
        featured: true,
        bestseller: false,
      },
      {
        name: 'Gates Racing Performance Kevlar Timing Belt Kit',
        sku: 'GTS-TB-328',
        brand: 'Gates',
        categorySlug: 'engine-parts',
        price: 215.00,
        discountPrice: 189.99,
        stock: 22,
        description: 'Constructed with HNBR elastomeric composites and Kevlar reinforcement. Up to 3x stronger and 300% more heat resistant than standard OEM rubber belts.',
        specifications: [
          { key: 'Belt Construction', value: 'Kevlar Reinforced HNBR' },
          { key: 'Included Components', value: 'Timing Belt, Water Pump, Tensioner, Idlers' },
        ],
        images: ['/media/olarts-caps-1937013_1920.jpg'],
        compatibility: [
          { make: 'Subaru', model: 'Impreza WRX STI (EJ257)', yearStart: 2004, yearEnd: 2021 },
          { make: 'Mitsubishi', model: 'Lancer Evolution IX', yearStart: 2006, yearEnd: 2007 },
        ],
        featured: false,
        bestseller: true,
      },
      {
        name: 'ARP High-Performance Head Stud Kit 2000 Series',
        sku: 'ARP-208-4301',
        brand: 'ARP',
        categorySlug: 'engine-parts',
        price: 185.00,
        discountPrice: 0,
        stock: 30,
        description: 'Premium grade 8740 chrome-moly steel alloy head studs rated at 220,000 psi tensile strength. Eliminates cylinder head lift under high boost pressure.',
        specifications: [
          { key: 'Tensile Strength', value: '220,000 PSI' },
          { key: 'Thread Size', value: 'M11 x 1.25' },
          { key: 'Fastener Style', value: 'Studs with 12-Point Nuts' },
        ],
        images: ['/media/life-of-pix-cylinders-569151_1920.jpg'],
        compatibility: [
          { make: 'Ford', model: 'Mustang GT (5.0L Coyote)', yearStart: 2011, yearEnd: 2023 },
          { make: 'Chevrolet', model: 'Corvette (6.2L LS3/LT1)', yearStart: 2008, yearEnd: 2019 },
        ],
        featured: false,
        bestseller: true,
      },

      // Suspension & Steering
      {
        name: 'KW Suspensions V3 Inox-Line Adjustable Coilover Kit',
        sku: 'KW-V3-3522',
        brand: 'KW Suspensions',
        categorySlug: 'suspension-steering',
        price: 2799.00,
        discountPrice: 2599.00,
        stock: 6,
        description: 'Independently adjustable rebound and compression damping with stainless steel Inox-Line shock bodies. Provides uncompromised cornering stability and ride quality.',
        specifications: [
          { key: 'Front Lowering Range', value: '15mm - 45mm' },
          { key: 'Rear Lowering Range', value: '15mm - 40mm' },
          { key: 'Body Material', value: 'Stainless Steel (Inox-Line)' },
          { key: 'Damping Specs', value: '16-Click Rebound / 12-Click Compression' },
        ],
        images: ['/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [
          { make: 'BMW', model: 'M2 Competition (F87)', yearStart: 2018, yearEnd: 2021 },
          { make: 'Toyota', model: 'GR Supra (A90)', yearStart: 2020, yearEnd: 2024 },
        ],
        featured: true,
        bestseller: false,
      },
      {
        name: 'Moog Problem Solver Front Upper & Lower Control Arm Kit',
        sku: 'MOG-CK620054',
        brand: 'Moog',
        categorySlug: 'suspension-steering',
        price: 320.00,
        discountPrice: 289.00,
        stock: 15,
        description: 'Pre-assembled heavy-duty control arms featuring greaseable ball joints and high-density synthetic rubber bushings to eliminate front-end clunks.',
        specifications: [
          { key: 'Bushings', value: 'High Performance Synthetic Rubber' },
          { key: 'Ball Joint', value: 'Greasable Metal-on-Metal Design' },
          { key: 'Position', value: 'Front Pair' },
        ],
        images: ['/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [
          { make: 'Ford', model: 'F-150 4WD', yearStart: 2015, yearEnd: 2022 },
          { make: 'Ford', model: 'Expedition', yearStart: 2018, yearEnd: 2023 },
        ],
        featured: false,
        bestseller: false,
      },

      // Transmission & Drivetrain
      {
        name: 'Exedy Stage 2 Mach 500 Thick Clutch Kit & Flywheel',
        sku: 'EXD-08952-ST2',
        brand: 'Exedy',
        categorySlug: 'transmission-drivetrain',
        price: 785.00,
        discountPrice: 729.00,
        stock: 10,
        description: 'Cerametallic friction disc designed to hold up to 550 lb-ft of torque while retaining street-friendly pedal engagement. Includes lightweight chromoly flywheel.',
        specifications: [
          { key: 'Torque Rating', value: '550 lb-ft Capacity' },
          { key: 'Disc Material', value: 'Cerametallic Cushion Button' },
          { key: 'Flywheel Weight', value: '14.8 lbs Billet Chromoly' },
        ],
        images: ['/media/mimzy-clutch-2755548_1920.jpg'],
        compatibility: [
          { make: 'Ford', model: 'Mustang GT (MT-82)', yearStart: 2015, yearEnd: 2023 },
          { make: 'Chevrolet', model: 'Camaro SS (TR-6060)', yearStart: 2016, yearEnd: 2023 },
        ],
        featured: true,
        bestseller: true,
      },

      // Electrical & Ignition
      {
        name: 'NGK Laser Iridium Spark Plugs (Set of 6)',
        sku: 'NGK-SILZKFR8D7S',
        brand: 'NGK',
        categorySlug: 'electrical-ignition',
        price: 94.50,
        discountPrice: 82.00,
        stock: 60,
        description: 'Laser-welded iridium tip center electrode ensures high durability and stable ignition flame. Recommended for stock and Stage 1 tuned engines.',
        specifications: [
          { key: 'Electrode Tip', value: '0.6mm Fine Wire Iridium' },
          { key: 'Heat Range', value: '8 (1 Step Colder)' },
          { key: 'Pre-gapped', value: '0.028 Inches' },
        ],
        images: ['/media/olarts-caps-1937013_1920.jpg'],
        compatibility: [
          { make: 'BMW', model: '335i / M235i (N55)', yearStart: 2012, yearEnd: 2016 },
          { make: 'BMW', model: '340i / M240i (B58)', yearStart: 2016, yearEnd: 2021 },
        ],
        featured: false,
        bestseller: true,
      },
      {
        name: 'Bosch 220A High Output Performance Alternator',
        sku: 'BSH-ALT-0124',
        brand: 'Bosch',
        categorySlug: 'electrical-ignition',
        price: 389.00,
        discountPrice: 349.00,
        stock: 12,
        description: 'Heavy duty high amperage output alternator providing steady voltage delivery even under high audio system loads or auxiliary lighting setup.',
        specifications: [
          { key: 'Output Current', value: '220 Amperes' },
          { key: 'Pulley Style', value: '6-Groove Clutch Pulley' },
          { key: 'Voltage Regulation', value: 'Internal Smart Regulator' },
        ],
        images: ['/media/olarts-caps-1937013_1920.jpg'],
        compatibility: [
          { make: 'Mercedes-Benz', model: 'C63 AMG (W204)', yearStart: 2008, yearEnd: 2015 },
          { make: 'Mercedes-Benz', model: 'E550', yearStart: 2010, yearEnd: 2016 },
        ],
        featured: false,
        bestseller: false,
      },

      // Lighting & Electronics
      {
        name: 'Morimoto XB LED Sequential Headlight Assemblies Pair',
        sku: 'MRM-LED-HD-902',
        brand: 'Morimoto',
        categorySlug: 'lighting-electronics',
        price: 1350.00,
        discountPrice: 1250.00,
        stock: 7,
        description: 'Full Bi-LED projectors with startup sequence and dynamic amber sequential turn signals. DOT & SAE compliant with UV-coated poly-carbonate lenses.',
        specifications: [
          { key: 'Low Beam Output', value: '3,800 Lumens Per Side' },
          { key: 'Color Temperature', value: '5,500K Pure White' },
          { key: 'DRL Function', value: 'White Daytime Running Lights' },
        ],
        images: ['/media/dayronv-nissan-885309_1920.jpg'],
        compatibility: [
          { make: 'Nissan', model: '370Z (Z34)', yearStart: 2009, yearEnd: 2020 },
          { make: 'Ford', model: 'Mustang', yearStart: 2018, yearEnd: 2023 },
        ],
        featured: true,
        bestseller: true,
      },

      // Performance Upgrades & Intake
      {
        name: 'Garrett Motion GTX3582R Gen II Dual Ball Bearing Turbocharger',
        sku: 'GAR-GTX3582R-II',
        brand: 'Garrett',
        categorySlug: 'performance-upgrades',
        price: 2150.00,
        discountPrice: 1999.00,
        stock: 5,
        description: 'Supports up to 850 HP. Features billet forged aluminum compressor wheel and dual ceramic ball bearing cartridge for rapid spool and extreme durability.',
        specifications: [
          { key: 'Compressor Inducer', value: '66mm' },
          { key: 'Compressor Exducer', value: '82mm' },
          { key: 'Turbine Housing', value: '0.82 A/R T4 V-Band' },
        ],
        images: ['/media/barni1-automobile-679874_1920.jpg'],
        compatibility: [
          { make: 'Nissan', model: 'GT-R (R35)', yearStart: 2009, yearEnd: 2024 },
          { make: 'Toyota', model: 'Supra (JZA80 2JZ-GTE)', yearStart: 1993, yearEnd: 2002 },
        ],
        featured: true,
        bestseller: false,
      },
      {
        name: 'Mishimoto Carbon Fiber Cold Air Intake System',
        sku: 'MSH-CAI-CF100',
        brand: 'Mishimoto',
        categorySlug: 'performance-upgrades',
        price: 495.00,
        discountPrice: 449.00,
        stock: 16,
        description: 'Improves airflow by 35% over stock airbox and delivers a dyno-proven gain of 14 HP and 16 lb-ft torque without requiring a ECU reflash.',
        specifications: [
          { key: 'Pipe Material', value: '3K Twill Weave Carbon Fiber' },
          { key: 'Filter Type', value: 'Oiled High-Flow Cotton Filter' },
        ],
        images: ['/media/barni1-automobile-679874_1920.jpg'],
        compatibility: [
          { make: 'Honda', model: 'Civic Si (1.5T)', yearStart: 2017, yearEnd: 2021 },
          { make: 'Acura', model: 'Integra A-Spec', yearStart: 2023, yearEnd: 2024 },
        ],
        featured: false,
        bestseller: true,
      },

      // Cooling & Heating
      {
        name: 'CSF Triple Pass Performance Aluminum Radiator',
        sku: 'CSF-RAD-7052',
        brand: 'CSF Racing',
        categorySlug: 'cooling-heating',
        price: 589.00,
        discountPrice: 535.00,
        stock: 9,
        description: 'Features CSF B-Tube technology with 2-row 42mm core. Triple pass internal design forces coolant through radiator 3 times for maximum heat exchange.',
        specifications: [
          { key: 'Core Thickness', value: '42mm Dual Row' },
          { key: 'Finish', value: 'Hand Polished Mirror Finish' },
          { key: 'Drain Plug', value: 'CNC Machined Brass Drain' },
        ],
        images: ['/media/life-of-pix-cylinders-569151_1920.jpg'],
        compatibility: [
          { make: 'BMW', model: 'M3 (E46 / E92)', yearStart: 2001, yearEnd: 2013 },
          { make: 'Porsche', model: 'Cayman S (987)', yearStart: 2006, yearEnd: 2012 },
        ],
        featured: false,
        bestseller: false,
      },

      // Exhaust Systems
      {
        name: 'Invidia GEMINI Dual Titanium Tip Cat-Back Exhaust System',
        sku: 'INV-HS09N7ZGMIT',
        brand: 'Invidia',
        categorySlug: 'exhaust-systems',
        price: 1450.00,
        discountPrice: 1320.00,
        stock: 6,
        description: 'Crafted from mandrel-bent SUS304 stainless steel tubing with titanium burned blue quad tips. Delivers a deep, aggressive exhaust note with zero drone.',
        specifications: [
          { key: 'Piping Diameter', value: '60mm to 70mm Tapered' },
          { key: 'Tip Finish', value: 'Burned Titanium Quad 110mm' },
          { key: 'Weight Saved', value: '18 lbs vs OEM Exhaust' },
        ],
        images: ['/media/paulbr75-automotive-3052297_1920.jpg'],
        compatibility: [
          { make: 'Nissan', model: '370Z (Z34)', yearStart: 2009, yearEnd: 2020 },
          { make: 'Infiniti', model: 'G37 Coupe', yearStart: 2008, yearEnd: 2013 },
        ],
        featured: true,
        bestseller: true,
      },

      // Filters & Fluids
      {
        name: 'K&N Select High Flow Spin-On Synthetic Oil Filter',
        sku: 'KN-HP-1008',
        brand: 'K&N',
        categorySlug: 'filters-maintenance',
        price: 16.99,
        discountPrice: 14.50,
        stock: 120,
        description: 'Synthetic blend media traps 99% of harmful contaminants while maintaining high flow rates. Includes 1-inch exposed nut for rapid wrench removal.',
        specifications: [
          { key: 'Filter Media', value: 'Synthetic Blend Micro-Glass' },
          { key: 'Removal Nut', value: '1 Inch Hex Nut Pre-drilled for Safety Wire' },
        ],
        images: ['/media/olarts-caps-1937013_1920.jpg'],
        compatibility: [
          { make: 'Honda', model: 'Civic / Accord / CR-V', yearStart: 2000, yearEnd: 2024 },
          { make: 'Acura', model: 'MDX / RDX / TLX', yearStart: 2005, yearEnd: 2024 },
        ],
        featured: false,
        bestseller: true,
      },
      {
        name: 'Motul 300V Power 5W-40 Synthetic Racing Motor Oil (5 Liters)',
        sku: 'MTL-300V-5W40',
        brand: 'Motul',
        categorySlug: 'lubricants-fluids',
        price: 98.00,
        discountPrice: 85.00,
        stock: 50,
        description: 'Ester Core Technology formulated for maximum power output and oil film resistance at extreme engine operating temperatures.',
        specifications: [
          { key: 'Viscosity', value: '5W-40 Full Synthetic' },
          { key: 'Volume', value: '5 Liters (5.28 Quarts)' },
          { key: 'Technology', value: 'Ester Core Double Ester' },
        ],
        images: ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'],
        compatibility: [
          { make: 'Universal', model: 'All High Performance Gas & Diesel Engines', yearStart: 1990, yearEnd: 2025 },
        ],
        featured: false,
        bestseller: true,
      },

      // Tools & Equipment
      {
        name: 'Autel MaxiCOM MK908P OBD2 Diagnostic Scanner & ECU Programmer',
        sku: 'ATL-MK908P-EVO',
        brand: 'Autel',
        categorySlug: 'garage-tools-equipment',
        price: 2499.00,
        discountPrice: 2299.00,
        stock: 4,
        description: 'Professional grade diagnostic tablet featuring OE-level complete system scanning, J2534 ECU programming, bidirectional controls, and 36+ service functions.',
        specifications: [
          { key: 'Display Screen', value: '10.1 Inch Retina Touchscreen' },
          { key: 'Processor', value: 'Octa-Core 2.0 GHz' },
          { key: 'Wireless VCI', value: 'Bluetooth J2534 Passthru Box' },
        ],
        images: ['/media/paulbr75-automotive-3052297_1920.jpg'],
        compatibility: [
          { make: 'Universal', model: 'Supports 80+ Asian, European & US Vehicle Makes', yearStart: 1996, yearEnd: 2025 },
        ],
        featured: true,
        bestseller: false,
      },
      {
        name: 'QuickJack BL-5000SLX 5,000 lbs Portable Car Lift System',
        sku: 'QJK-BL5000-110V',
        brand: 'QuickJack',
        categorySlug: 'garage-tools-equipment',
        price: 1650.00,
        discountPrice: 1520.00,
        stock: 3,
        description: 'Portable hydraulic vehicle lift with dual automatic safety lock bars. Collapses to 3 inches high and raises your vehicle 24 inches in under 30 seconds.',
        specifications: [
          { key: 'Lifting Capacity', value: '5,000 lbs (2,268 kg)' },
          { key: 'Max Lift Height', value: '24.2 Inches' },
          { key: 'Power Unit', value: '110V AC Hydraulic Power Unit' },
        ],
        images: ['/media/paulbr75-automotive-3052297_1920.jpg'],
        compatibility: [
          { make: 'Universal', model: 'All Cars, Light Trucks & SUVs under 5000 lbs', yearStart: 1980, yearEnd: 2025 },
        ],
        featured: false,
        bestseller: false,
      },
      // Additional realistic products to reach 30 items
      {
        name: 'Bilstein B8 5100 Series Height Adjustable Shock Absorbers',
        sku: 'BLS-24-239370',
        brand: 'Bilstein',
        categorySlug: 'suspension-steering',
        price: 165.00,
        discountPrice: 148.00,
        stock: 24,
        description: 'Monotube gas pressure shocks designed for leveled or lifted trucks and SUVs. Provides superior ride control on highway and off-road terrain.',
        specifications: [{ key: 'Body Design', value: '46mm Monotube Zinc Plated' }],
        images: ['/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [{ make: 'Toyota', model: 'Tacoma 4WD', yearStart: 2016, yearEnd: 2023 }],
        featured: false,
        bestseller: true,
      },
      {
        name: 'HKS Super Power Flow Cold Air Intake Reloaded Kit',
        sku: 'HKS-70020-AT001',
        brand: 'HKS',
        categorySlug: 'performance-upgrades',
        price: 360.00,
        discountPrice: 329.00,
        stock: 14,
        description: 'Super-stealthy green 3-layer dry polyurethane filter with polished aluminum piping for maximum air suction velocity.',
        specifications: [{ key: 'Filter Diameter', value: '200mm Outer Rim' }],
        images: ['/media/barni1-automobile-679874_1920.jpg'],
        compatibility: [{ make: 'Toyota', model: '86 / Subaru BRZ', yearStart: 2013, yearEnd: 2020 }],
        featured: false,
        bestseller: false,
      },
      {
        name: 'Optima RedTop High-Performance AGM Starter Battery',
        sku: 'OPT-8020-164-34',
        brand: 'Optima Batteries',
        categorySlug: 'electrical-ignition',
        price: 249.99,
        discountPrice: 229.99,
        stock: 19,
        description: 'SpiralCell Technology delivers 800 Cold Cranking Amps (CCA) and 15x stronger vibration resistance than conventional flooded batteries.',
        specifications: [{ key: 'CCA Rating', value: '800 Amps' }, { key: 'Reserve Capacity', value: '100 Minutes' }],
        images: ['/media/olarts-caps-1937013_1920.jpg'],
        compatibility: [{ make: 'Universal', model: 'Group 34 Standard Battery Tray', yearStart: 1995, yearEnd: 2025 }],
        featured: false,
        bestseller: true,
      },
      {
        name: 'Seibon Carbon Fiber OEM-Style Bonnet Hood',
        sku: 'SBN-HD0810N370-OE',
        brand: 'Seibon Carbon',
        categorySlug: 'body-parts-trim',
        price: 1120.00,
        discountPrice: 1040.00,
        stock: 4,
        description: 'Lightweight hand-laid carbon fiber bonnet with glossy clear coat finish. Reduces nose weight by over 50% for sharper turn-in response.',
        specifications: [{ key: 'Weave Pattern', value: '2x2 Twill Weave' }],
        images: ['/media/gahsh-cars-975634_1920.jpg'],
        compatibility: [{ make: 'Nissan', model: '370Z', yearStart: 2009, yearEnd: 2020 }],
        featured: false,
        bestseller: false,
      },
      {
        name: 'Michelin Pilot Sport 4S Ultra-High Performance Summer Tire',
        sku: 'MCH-PS4S-2653519',
        brand: 'Michelin',
        categorySlug: 'wheels-tires',
        price: 345.00,
        discountPrice: 319.00,
        stock: 32,
        description: '#1 ranked ultra-high performance tire. Multi-compound technology delivers incredible dry cornering grip and exceptional wet braking performance.',
        specifications: [{ key: 'Size', value: '265/35ZR19 (98Y) XL' }, { key: 'Treadwear Rating', value: '300 AA A' }],
        images: ['/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [{ make: 'BMW', model: 'M3 / M4 / M2', yearStart: 2015, yearEnd: 2024 }],
        featured: true,
        bestseller: true,
      },
      {
        name: 'BBS LM 2-Piece Forged Diamond Silver Wheel (19x9.5 ET22)',
        sku: 'BBS-LM1995-DS',
        brand: 'BBS Wheels',
        categorySlug: 'wheels-tires',
        price: 1480.00,
        discountPrice: 1399.00,
        stock: 12,
        description: 'Iconic mesh design featuring 2-piece die-forged aluminum star rim and titanium hardware. Made in Germany to rigorous motorsport standards.',
        specifications: [{ key: 'Bolt Pattern', value: '5x120' }, { key: 'Center Bore', value: '72.6mm' }],
        images: ['/media/pineapple22productions-wheel-4640912_1920.jpg'],
        compatibility: [{ make: 'BMW', model: 'M3 / 3 Series (E46 / E92 / F80)', yearStart: 2001, yearEnd: 2020 }],
        featured: true,
        bestseller: false,
      },
      {
        name: 'Sparco R100 Black Fabric Street Tuning Seat Pair',
        sku: 'SPC-00961NR-PR',
        brand: 'Sparco',
        categorySlug: 'interior-accessories',
        price: 780.00,
        discountPrice: 720.00,
        stock: 8,
        description: 'Reclining sports seats with high-density foam side bolsters and harness slots for 3 or 4-point racing harnesses.',
        specifications: [{ key: 'Frame', value: 'Tubular Steel Frame' }],
        images: ['/media/schwarzenarzisse-antique-car-365354_1920.jpg'],
        compatibility: [{ make: 'Universal', model: 'All vehicles with aftermarket seat brackets', yearStart: 1990, yearEnd: 2025 }],
        featured: false,
        bestseller: false,
      },
      {
        name: 'Red Line Synthetic 75W-90 High Performance Gear Oil (1 Gallon)',
        sku: 'RDL-57905-GL',
        brand: 'Red Line',
        categorySlug: 'lubricants-fluids',
        price: 68.00,
        discountPrice: 59.99,
        stock: 40,
        description: 'Ester-based gear lubricant for manual transmissions and differentials. Eliminates notchiness and provides smooth synchro engagement.',
        specifications: [{ key: 'API Rating', value: 'GL-5 Plus' }],
        images: ['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'],
        compatibility: [{ make: 'Universal', model: 'Manual Transmissions & Rear Differentials', yearStart: 1985, yearEnd: 2025 }],
        featured: false,
        bestseller: true,
      },
      {
        name: 'Mishimoto Thermostatic Oil Cooler Kit (19 Row)',
        sku: 'MSH-OC-19RT',
        brand: 'Mishimoto',
        categorySlug: 'cooling-heating',
        price: 425.00,
        discountPrice: 385.00,
        stock: 11,
        description: 'Reduces oil temperatures by up to 35°F under hard track driving. Integrated 185°F thermostatic sandwich plate prevents cold-oil wear.',
        specifications: [{ key: 'Core Size', value: '19 Row Stacked Plate' }],
        images: ['/media/life-of-pix-cylinders-569151_1920.jpg'],
        compatibility: [{ make: 'Subaru', model: 'WRX / STI / BRZ', yearStart: 2015, yearEnd: 2023 }],
        featured: false,
        bestseller: false,
      },
      {
        name: 'Vibrant Performance HD Clamp System (3.0 Inch Anodized Black)',
        sku: 'VBR-13170',
        brand: 'Vibrant Performance',
        categorySlug: 'exhaust-systems',
        price: 79.99,
        discountPrice: 69.99,
        stock: 35,
        description: 'Billet aluminum quick-release clamp system designed for high-boost charge piping and intercooler couplers up to 80 PSI.',
        specifications: [{ key: 'Material', value: '6061 Billet Aluminum' }],
        images: ['/media/paulbr75-automotive-3052297_1920.jpg'],
        compatibility: [{ make: 'Universal', model: '3.0 Inch Turbo Piping', yearStart: 1990, yearEnd: 2025 }],
        featured: false,
        bestseller: false,
      },
    ];

    for (const pData of productsData) {
      const catId = categoriesMap[pData.categorySlug];
      if (catId) {
        const slug = pData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await Product.create({
          ...pData,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          category: catId,
          active: true,
        });
      }
    }
    console.log(`[Seed] 30 Products created successfully.`);

    // 4. Create 8 Garage Services
    const servicesData = [
      {
        name: 'Master Diagnostic Scan & Electrical Troubleshooting',
        slug: 'master-diagnostic-scan',
        description: 'Comprehensive computer OBD2 diagnostic scan, sensor calibration, freeze-frame data analysis, and wiring circuit testing by ASE Certified Master Technicians.',
        image: '/media/paulbr75-automotive-3052297_1920.jpg',
        price: 119.00,
        duration: '1 Hour',
        active: true,
        featured: true,
      },
      {
        name: 'Full Synthetic Oil Change & Filter Replacement',
        slug: 'full-synthetic-oil-change',
        description: 'Includes up to 5 Quarts of premium Motul/Mobil1 full synthetic oil, OE filter replacement, 30-point safety inspection, and fluid top-off.',
        image: '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg',
        price: 89.00,
        duration: '45 Minutes',
        active: true,
        featured: true,
      },
      {
        name: 'Precision 3D Laser Wheel Alignment',
        slug: 'precision-wheel-alignment',
        description: 'State-of-the-art Hunter HawkEye 3D laser alignment adjusting camber, caster, and toe specs for extended tire life and track precision stability.',
        image: '/media/pineapple22productions-wheel-4640912_1920.jpg',
        price: 149.00,
        duration: '1 - 1.5 Hours',
        active: true,
        featured: true,
      },
      {
        name: 'Complete Brake System Overhaul & Fluid Flush',
        slug: 'brake-system-overhaul',
        description: 'Installation of new brake pads and rotors, caliper pin lubrication, DOT4 pressure fluid flush, and pedal pressure calibration.',
        image: '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg',
        price: 249.00,
        duration: '2 Hours',
        active: true,
        featured: true,
      },
      {
        name: 'Air Conditioning Climate System Recharge & Leak Test',
        slug: 'ac-system-recharge',
        description: 'R134a / R1234yf refrigerant vacuum pressure test, dye injection leak check, compressor oil top-off, and cabin evaporator sterilization.',
        image: '/media/dayronv-nissan-885309_1920.jpg',
        price: 129.00,
        duration: '1 Hour',
        active: true,
        featured: false,
      },
      {
        name: 'Transmission Flush & Filter Service',
        slug: 'transmission-flush-service',
        description: 'Complete high-pressure transmission fluid replacement, pan gasket renewal, magnetic pan cleaning, and ECU adaptions reset.',
        image: '/media/mimzy-clutch-2755548_1920.jpg',
        price: 299.00,
        duration: '2.5 Hours',
        active: true,
        featured: false,
      },
      {
        name: 'Suspension Strut & Coilover Tuning Service',
        slug: 'suspension-strut-tuning',
        description: 'Custom height adjustment, dampening clicker tuning, corner balancing setup, and bushing inspection for street or track cars.',
        image: '/media/pineapple22productions-wheel-4640912_1920.jpg',
        price: 199.00,
        duration: '2 Hours',
        active: true,
        featured: false,
      },
      {
        name: 'Timing Belt & Water Pump Complete Service',
        slug: 'timing-belt-service',
        description: 'Preventative replacement of engine timing belt, tensioner pulley, idler bearings, water pump, and fresh coolant refill.',
        image: '/media/life-of-pix-cylinders-569151_1920.jpg',
        price: 549.00,
        duration: '4 - 5 Hours',
        active: true,
        featured: false,
      },
    ];

    for (const service of servicesData) {
      await Service.create(service);
    }
    console.log(`[Seed] 8 Garage Services created.`);

    // 5. Create 5 Testimonials
    const testimonialsData = [
      {
        customerName: 'Alexander Hayes',
        customerRole: 'Track Day Driver & M3 Owner',
        customerImage: '/media/dayronv-nissan-885309_1920.jpg',
        rating: 5,
        comment: 'Apex Motors is hands down the best automotive shop I have ever used. They installed my Brembo GT-R brake kit and dialed in the KW coilover suspension perfectly. The car handles like it is on rails!',
        active: true,
      },
      {
        customerName: 'Elena Rostova',
        customerRole: 'Audi S3 Performance Enthusiast',
        customerImage: '/media/barni1-automobile-679874_1920.jpg',
        rating: 5,
        comment: 'Fast shipping, genuine OEM parts, and incredible customer support. Ordering through their online store was seamless, and the fitment checker guaranteed the parts matched my vehicle exactly.',
        active: true,
      },
      {
        customerName: 'David Sterling',
        customerRole: 'Classic & Modern Mustang Collector',
        customerImage: '/media/gahsh-cars-975634_1920.jpg',
        rating: 5,
        comment: 'Took my Mustang in for a full diagnostic scan and clutch replacement. The technicians are true craftsmen who treat your vehicle with extreme respect. Highly recommended!',
        active: true,
      },
      {
        customerName: 'Samantha Reed',
        customerRole: 'Toyota RAV4 Owner',
        customerImage: '/media/schwarzenarzisse-antique-car-365354_1920.jpg',
        rating: 5,
        comment: 'Honest pricing and ultra-fast service! Had my oil change and brake pads done in less than an hour. The glassmorphic workshop lounge is beautiful as well.',
        active: true,
      },
      {
        customerName: 'Michael Chen',
        customerRole: 'Nissan 370Z Tuner',
        customerImage: '/media/dayronv-nissan-885309_1920.jpg',
        rating: 5,
        comment: 'The Invidia titanium exhaust system arrived within 2 days in flawless packaging. Apex Motors is my go-to shop for all high performance parts!',
        active: true,
      },
    ];

    for (const t of testimonialsData) {
      await Testimonial.create(t);
    }
    console.log(`[Seed] 5 Testimonials created.`);

    // 6. Create 3 Hero Slides (using local video and images!)
    const heroSlidesData = [
      {
        title: 'PREMIUM AUTO PARTS. BUILT FOR THE ROAD.',
        subtitle: 'Uncompromising engineering, factory-tested reliability, and precision components for track and street performance.',
        image: '/media/barni1-automobile-679874_1920.jpg',
        video: '/media/141581-777930475_medium.mp4',
        buttonText: 'Shop Parts Store',
        buttonLink: '/store',
        active: true,
        order: 1,
      },
      {
        title: 'PROFESSIONAL GARAGE & MASTER DIAGNOSTICS',
        subtitle: 'State-of-the-art 3D laser alignment, ECU tuning, and certified ASE master technicians at your service.',
        image: '/media/dayronv-nissan-885309_1920.jpg',
        video: '/media/177443-857376870_medium.mp4',
        buttonText: 'Book Service Now',
        buttonLink: '/services',
        active: true,
        order: 2,
      },
      {
        title: 'UP TO 30% OFF PERFORMANCE BRAKES & SUSPENSION',
        subtitle: 'Upgrade your stopping power and cornering dynamics with world-class Brembo, KW, and EBC components.',
        image: '/media/gahsh-cars-975634_1920.jpg',
        video: '/media/31139-384523221_medium.mp4',
        buttonText: 'Explore Exclusive Deals',
        buttonLink: '/store?featured=true',
        active: true,
        order: 3,
      },
    ];

    for (const hero of heroSlidesData) {
      await HeroSlide.create(hero);
    }
    console.log(`[Seed] 3 Hero Slides created successfully.`);

    console.log('[Seed] Database seeding completed cleanly!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
