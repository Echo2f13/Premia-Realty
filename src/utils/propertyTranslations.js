/**
 * Property Translation Utilities
 *
 * Handles translation of property content (titles, descriptions, amenities, etc.)
 * between English and Arabic
 */

// Common property type translations
export const propertyTypeTranslations = {
  'Villa': { en: 'Villa', ar: 'فيلا' },
  'Apartment': { en: 'Apartment', ar: 'شقة' },
  'Penthouse': { en: 'Penthouse', ar: 'بنتهاوس' },
  'Townhouse': { en: 'Townhouse', ar: 'منزل' },
  'Duplex': { en: 'Duplex', ar: 'دوبلكس' },
  'Building': { en: 'Building', ar: 'مبنى' },
  'Studio': { en: 'Studio', ar: 'استوديو' },
  'Office': { en: 'Office', ar: 'مكتب' },
  'Commercial': { en: 'Commercial', ar: 'تجاري' },
  'Land': { en: 'Land', ar: 'أرض' },
};

// Common amenity translations
export const amenityTranslations = {
  'Gym': { en: 'Gym', ar: 'صالة رياضية' },
  'Swimming Pool': { en: 'Swimming Pool', ar: 'مسبح' },
  'Pool': { en: 'Pool', ar: 'مسبح' },
  'Private Pool': { en: 'Private Pool', ar: 'مسبح خاص' },
  'Shared Pool': { en: 'Shared Pool', ar: 'مسبح مشترك' },
  'Parking': { en: 'Parking', ar: 'موقف سيارات' },
  'Covered Parking': { en: 'Covered Parking', ar: 'موقف سيارات مغطى' },
  'Security': { en: 'Security', ar: 'أمن' },
  '24/7 Security': { en: '24/7 Security', ar: 'أمن 24/7' },
  'Concierge': { en: 'Concierge', ar: 'كونسيرج' },
  'Garden': { en: 'Garden', ar: 'حديقة' },
  'Private Garden': { en: 'Private Garden', ar: 'حديقة خاصة' },
  "Maid's Room": { en: "Maid's Room", ar: 'غرفة خادمة' },
  'Maid Room': { en: 'Maid Room', ar: 'غرفة خادمة' },
  'Storage Room': { en: 'Storage Room', ar: 'غرفة تخزين' },
  'Balcony': { en: 'Balcony', ar: 'شرفة' },
  'Terrace': { en: 'Terrace', ar: 'تراس' },
  'BBQ Area': { en: 'BBQ Area', ar: 'منطقة شواء' },
  'Garage': { en: 'Garage', ar: 'مرآب' },
  "Children's Play Area": { en: "Children's Play Area", ar: 'منطقة لعب أطفال' },
  'Playground': { en: 'Playground', ar: 'ملعب' },
  'Elevator': { en: 'Elevator', ar: 'مصعد' },
  'Central AC': { en: 'Central AC', ar: 'تكييف مركزي' },
  'Kitchen': { en: 'Kitchen', ar: 'مطبخ' },
  'Equipped Kitchen': { en: 'Equipped Kitchen', ar: 'مطبخ مجهز' },
  'Laundry Room': { en: 'Laundry Room', ar: 'غرفة غسيل' },
  'Pets Allowed': { en: 'Pets Allowed', ar: 'مسموح بالحيوانات الأليفة' },
  'Furnished': { en: 'Furnished', ar: 'مفروش' },
  'Semi-Furnished': { en: 'Semi-Furnished', ar: 'نصف مفروش' },
  'Unfurnished': { en: 'Unfurnished', ar: 'غير مفروش' },
  'Sea View': { en: 'Sea View', ar: 'إطلالة بحرية' },
  'City View': { en: 'City View', ar: 'إطلالة على المدينة' },
  'Garden View': { en: 'Garden View', ar: 'إطلالة على الحديقة' },
  'Beach Access': { en: 'Beach Access', ar: 'الوصول إلى الشاطئ' },
  'Marina': { en: 'Marina', ar: 'مارينا' },
  'Spa': { en: 'Spa', ar: 'سبا' },
  'Sauna': { en: 'Sauna', ar: 'ساونا' },
  'Jacuzzi': { en: 'Jacuzzi', ar: 'جاكوزي' },
  'Internet Ready': { en: 'Internet Ready', ar: 'جاهز للإنترنت' },
  'WiFi': { en: 'WiFi', ar: 'واي فاي' },
  'Smart Home': { en: 'Smart Home', ar: 'منزل ذكي' },
  'Reception Area': { en: 'Reception Area', ar: 'منطقة استقبال' },
  'Meeting Rooms': { en: 'Meeting Rooms', ar: 'غرف اجتماعات' },
  'Pantry': { en: 'Pantry', ar: 'مخزن' },
  'Server Room': { en: 'Server Room', ar: 'غرفة خوادم' },
  'Valet Parking': { en: 'Valet Parking', ar: 'صف السيارات' },
  'Private Rooftop Pool': { en: 'Private Rooftop Pool', ar: 'مسبح خاص على السطح' },
  'Community Pool': { en: 'Community Pool', ar: 'مسبح المجتمع' },
};

// Governorate translations
export const governorateTranslations = {
  'Capital': { en: 'Capital', ar: 'العاصمة' },
  'Muharraq': { en: 'Muharraq', ar: 'المحرق' },
  'Northern': { en: 'Northern', ar: 'الشمالية' },
  'Southern': { en: 'Southern', ar: 'الجنوبية' },
};

// Area translations
export const areaTranslations = {
  'Seef': { en: 'Seef', ar: 'السيف' },
  'Juffair': { en: 'Juffair', ar: 'الجفير' },
  'Adliya': { en: 'Adliya', ar: 'العدلية' },
  'Saar': { en: 'Saar', ar: 'سار' },
  'Budaiya': { en: 'Budaiya', ar: 'البديع' },
  'Amwaj': { en: 'Amwaj', ar: 'أمواج' },
  'Amwaj Islands': { en: 'Amwaj Islands', ar: 'جزر أمواج' },
  'Riffa': { en: 'Riffa', ar: 'الرفاع' },
  'Riffa Views': { en: 'Riffa Views', ar: 'مناظر الرفاع' },
  'Manama': { en: 'Manama', ar: 'المنامة' },
  'Diplomatic Area': { en: 'Diplomatic Area', ar: 'المنطقة الدبلوماسية' },
  'Mahooz': { en: 'Mahooz', ar: 'المحوز' },
  'Sanabis': { en: 'Sanabis', ar: 'السنابس' },
  'Tubli': { en: 'Tubli', ar: 'توبلي' },
  'Isa Town': { en: 'Isa Town', ar: 'مدينة عيسى' },
  'Hamad Town': { en: 'Hamad Town', ar: 'مدينة حمد' },
  'Sitra': { en: 'Sitra', ar: 'سترة' },
  'Muharraq City': { en: 'Muharraq City', ar: 'مدينة المحرق' },
  'Hidd': { en: 'Hidd', ar: 'الحد' },
  'Diyar': { en: 'Diyar', ar: 'ديار' },
  'Durrat Al Bahrain': { en: 'Durrat Al Bahrain', ar: 'درة البحرين' },
};

/**
 * Get translated property field
 * @param {Object} property - Property object
 * @param {string} field - Field name (title, description, etc.)
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {string} - Translated value or fallback to English
 */
export const getPropertyField = (property, field, language = 'en') => {
  if (!property) return '';

  // Check if property has bilingual field
  if (property[`${field}_ar`] && language === 'ar') {
    return property[`${field}_ar`];
  }

  // Check if property has translations object
  if (property.translations && property.translations[field] && property.translations[field][language]) {
    return property.translations[field][language];
  }

  // Fallback to main field (assumed to be English)
  return property[field] || '';
};

/**
 * Translate amenity
 * @param {string} amenity - Amenity name in English
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {string} - Translated amenity
 */
export const translateAmenity = (amenity, language = 'en') => {
  if (!amenity) return '';

  const translation = amenityTranslations[amenity];
  if (translation && translation[language]) {
    return translation[language];
  }

  // Fallback to original
  return amenity;
};

/**
 * Translate property type
 * @param {string} type - Property type in English
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {string} - Translated type
 */
export const translatePropertyType = (type, language = 'en') => {
  if (!type) return '';

  const translation = propertyTypeTranslations[type];
  if (translation && translation[language]) {
    return translation[language];
  }

  // Fallback to original
  return type;
};

/**
 * Translate location
 * @param {Object} location - Location object
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Object} - Translated location
 */
export const translateLocation = (location, language = 'en') => {
  if (!location) return {};

  const governorate = location.governorate || '';
  const area = location.area || '';
  const city = location.city || '';

  return {
    governorate: governorateTranslations[governorate]?.[language] || governorate,
    area: areaTranslations[area]?.[language] || area,
    city: areaTranslations[city]?.[language] || city,
  };
};

/**
 * Get translated property - Returns property with all fields translated
 * @param {Object} property - Property object
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Object} - Property with translated fields
 */
export const getTranslatedProperty = (property, language = 'en') => {
  if (!property) return null;

  return {
    ...property,
    title: getPropertyField(property, 'title', language),
    description: getPropertyField(property, 'description', language),
    type: translatePropertyType(property.type, language),
    amenities: property.amenities?.map(amenity => translateAmenity(amenity, language)) || [],
    location: property.location ? {
      ...property.location,
      ...translateLocation(property.location, language),
    } : null,
  };
};
