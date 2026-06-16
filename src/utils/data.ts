import productsData from '../data/products_3_level_clean.json';

export interface Product {
  name: string;
  url: string;
  description: string;
  specifications: string[];
  image_url?: string;
  local_image?: string;
}

export interface SubCategory {
  sub_category_name: string;
  products: Product[];
}

export interface Category {
  category_name: string;
  sub_categories: SubCategory[];
}

export interface DisplayCategory {
  id: string; // url friendly id
  label: string;
  subCategories: string[];
  products: (Product & { sub_category_name: string, display_category: string, id: string })[];
}

const rawData = productsData as { company: string, categories: Category[] };

const CATEGORY_MAP: Record<string, string[]> = {
  'urology': ['Urology Catheters Manufacturer', 'Urology Dispodable Products'],
  'interventional-radiology': ['Interventional Radiology'],
  'gastroenterology': ['Gastroenterology', 'Gastroenterology Disposables Manufacturer', 'Sclerotherapy Needle'],
  'gynaecology': ['Gynaecology'],
  'nephrology': ['Nephrology']
};

const CATEGORY_LABELS: Record<string, string> = {
  'urology': 'Urology',
  'interventional-radiology': 'Radiology',
  'gastroenterology': 'Gastroenterology',
  'gynaecology': 'Gynaecology',
  'nephrology': 'Nephrology'
};

const ALL_PRODUCTS: (Product & { sub_category_name: string, display_category: string, id: string })[] = [];

export const getDisplayCategories = (): DisplayCategory[] => {
  const displayCategories: DisplayCategory[] = [];

  for (const [id, rawNames] of Object.entries(CATEGORY_MAP)) {
    const matchedCategories = rawData.categories.filter(c => rawNames.includes(c.category_name));
    
    const subCategoriesMap = new Map<string, (Product & { sub_category_name: string, display_category: string, id: string })[]>();
    
    matchedCategories.forEach(cat => {
      cat.sub_categories.forEach(sub => {
        const subName = sub.sub_category_name;
        if (!subCategoriesMap.has(subName)) {
          subCategoriesMap.set(subName, []);
        }
        
        const mappedProducts = sub.products.map(p => {
          // Generate an id safely
          const pId = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id;
          const mapped = {
            ...p,
            sub_category_name: subName,
            display_category: CATEGORY_LABELS[id],
            id: pId
          };
          
          if (!ALL_PRODUCTS.find(ext => ext.name.trim().toLowerCase() === mapped.name.trim().toLowerCase())) {
             ALL_PRODUCTS.push(mapped);
          }
          
          return mapped;
        });

        subCategoriesMap.get(subName)?.push(...mappedProducts);
      });
    });

    const products: (Product & { sub_category_name: string, display_category: string, id: string })[] = [];
    const seenNames = new Set<string>();
    
    subCategoriesMap.forEach(arr => {
      arr.forEach(p => {
        const nameKey = p.name.trim().toLowerCase();
        if (!seenNames.has(nameKey)) {
          seenNames.add(nameKey);
          products.push(p);
        }
      });
    });

    displayCategories.push({
      id,
      label: CATEGORY_LABELS[id],
      subCategories: Array.from(subCategoriesMap.keys()),
      products
    });
  }

  return displayCategories;
};

// Intialize cache
const parsedCategories = getDisplayCategories();

export const getAllProducts = () => {
    const all: (Product & { sub_category_name: string, display_category: string, id: string })[] = [];
    parsedCategories.forEach(c => all.push(...c.products));
    return all;
};

export const getCategoryById = (id: string) => {
  return parsedCategories.find(c => c.id === id);
};

export const getProductById = (id: string) => {
  return ALL_PRODUCTS.find(p => p.id === id);
};

export const getImageUrl = (localImage?: string, fallbackUrl?: string) => {
  if (localImage) {
    let cleanPath = localImage.replace('temp_images/', '');
    // Map known spelling/naming/extension mismatches
    if (cleanPath === 'Abcess_Drainage_Catheter.jpg') {
      cleanPath = 'Abscess-Drainage-Catheter.jpg';
    } else if (cleanPath === 'Abcess_Drainage_Malecot_Catheter.jpg') {
      cleanPath = 'Abscess_Drainage_Malecot_Catheter.jpg';
    } else if (cleanPath === 'Ureteral_Access_Sheath.jpg') {
      cleanPath = 'Ureteral_Access_Sheath.png';
    } else if (cleanPath === 'ureteric_catheter_Manufacturers.jpg') {
      cleanPath = 'ureteric_catheter_Manufacturersureteric_catheter_Manufacturers.jpg';
    } else if (cleanPath === 'Gastroenterology_Chiba_Needle.jpg') {
      cleanPath = 'Chiba_Needle.jpg';
    }
    return `/temp_images/${cleanPath}`;
  }
  return fallbackUrl || '';
};

export const getSimilarProducts = (product: Product & { display_category: string, id: string }) => {
  // Same display category
  const categoryProducts = parsedCategories.find(c => c.label === product.display_category)?.products || [];
  
  // Clean text helper
  const getKeywords = (text: string) => {
    return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  };
  
  const productKeywords = new Set([...getKeywords(product.name), ...getKeywords(product.description)]);
  
  const scoredProducts = categoryProducts
    .filter(p => p.id !== product.id)
    .map(p => {
      const pKeywords = [...getKeywords(p.name), ...getKeywords(p.description)];
      let matches = 0;
      pKeywords.forEach(kw => {
        if (productKeywords.has(kw)) matches++;
      });
      return { product: p, score: matches };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Return min 3, max 6 if available. If strict matches < 3, pad with random from same category
  const results = scoredProducts.slice(0, 6).map(s => s.product);
  
  if (results.length < 3) {
    const remaining = categoryProducts.filter(p => p.id !== product.id && !results.find(r => r.id === p.id));
    while (results.length < 3 && remaining.length > 0) {
      results.push(remaining.pop()!);
    }
  }
  
  return results.slice(0, 6);
};
