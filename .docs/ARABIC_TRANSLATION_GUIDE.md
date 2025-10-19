# Arabic Translation System Guide

## Overview

The Premia Real Estate website now supports full Arabic/English bilingual functionality. When users click the language toggle button in the navbar, the entire website (including property content) switches between English and Arabic.

## How It Works

### 1. UI Labels Translation

UI labels (buttons, menus, form labels, etc.) are translated using the translation system in:
- `src/contexts/LanguageContext.jsx` - Language state management
- `src/translations/index.js` - All UI translations (250+ keys)

### 2. Property Content Translation

Property content (titles, descriptions, amenities, locations) are translated using:
- `src/utils/propertyTranslations.js` - Property translation utilities
- Database fields: `title_ar` and `description_ar` for each property

## Database Structure

Each property in Firestore should have these fields:

```javascript
{
  // English (required)
  title: "Luxury 3BR Apartment in Seef - Sea View",
  description: "Stunning 3-bedroom apartment...",

  // Arabic (required for translation)
  title_ar: "شقة فاخرة 3 غرف نوم في السيف - إطلالة بحرية",
  description_ar: "شقة مذهلة بثلاث غرف نوم...",

  // Other fields...
  type: "Apartment",  // Automatically translated
  amenities: ["Gym", "Pool", "Parking"],  // Automatically translated
  location: {
    governorate: "Capital",  // Automatically translated
    city: "Manama",  // Automatically translated
    area: "Seef"  // Automatically translated
  }
}
```

## Adding Arabic Translations to Properties

### Method 1: Through Admin Panel (Recommended)

1. Log in to the admin panel
2. Go to **Properties** → **Add New Property** or **Edit Property**
3. You'll see fields for both English and Arabic:
   - **Property Title (English)** - Required
   - **Property Title (Arabic)** - Required
   - **Description (English)** - Optional
   - **Description (Arabic)** - Optional

4. Fill in both languages when creating/editing properties
5. The Arabic fields have `dir="rtl"` applied automatically for proper Arabic text direction

### Method 2: Using the Migration Script

For existing properties without Arabic translations:

```bash
node addArabicToProperties.js
```

This script will:
- Find all properties in your database
- Add Arabic translations for properties that match the sample translations
- Skip properties that already have Arabic translations
- Report which properties need manual translation

**Note:** You'll need to manually translate properties not in the sample list.

## What Gets Translated Automatically

The following are translated automatically based on predefined mappings:

### 1. Property Types
- Villa → فيلا
- Apartment → شقة
- Penthouse → بنتهاوس
- Townhouse → منزل
- Studio → استوديو
- Office → مكتب

### 2. Amenities
- Gym → صالة رياضية
- Swimming Pool → مسبح
- Parking → موقف سيارات
- Security → أمن
- Garden → حديقة
- And 50+ more amenities...

### 3. Locations
- Governorates: Capital, Muharraq, Northern, Southern
- Cities: Manama, Seef, Juffair, Saar, Amwaj, etc.

See `src/utils/propertyTranslations.js` for the complete list.

## Adding New Translations

### To Add a New Amenity Translation:

Edit `src/utils/propertyTranslations.js`:

```javascript
export const amenityTranslations = {
  // Existing amenities...
  'Your New Amenity': { en: 'Your New Amenity', ar: 'الترجمة العربية' },
};
```

### To Add a New Area Translation:

Edit `src/utils/propertyTranslations.js`:

```javascript
export const areaTranslations = {
  // Existing areas...
  'Your New Area': { en: 'Your New Area', ar: 'المنطقة الجديدة' },
};
```

## Testing the Translation System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the website** (http://localhost:5173)

3. **Test Language Toggle:**
   - Click the language button in the navbar (shows "ع" in English mode, "EN" in Arabic mode)
   - The entire website should switch language
   - Layout direction should switch (LTR ↔ RTL)

4. **Check Property Pages:**
   - Go to `/properties` - Property titles and locations should be in the selected language
   - Click on a property - Title, description, amenities should all be translated
   - Amenities and locations are translated automatically if they're in the translation dictionary

5. **Check Admin Panel:**
   - Create a new property - You should see English and Arabic fields
   - Edit an existing property - Arabic fields should be editable

## Common Issues

### Issue: Property showing English text when Arabic is selected

**Cause:** The property doesn't have `title_ar` or `description_ar` in the database.

**Solution:**
1. Edit the property in the admin panel
2. Add Arabic title and description
3. Save the property

### Issue: Amenity not translated

**Cause:** The amenity name doesn't exist in `amenityTranslations`.

**Solution:**
1. Add the amenity to `src/utils/propertyTranslations.js`
2. Or change the amenity name in the admin panel to match an existing translation

### Issue: Location not translated

**Cause:** The location name doesn't exist in `areaTranslations` or `governorateTranslations`.

**Solution:**
Add the location to `src/utils/propertyTranslations.js`

## File Structure

```
src/
├── contexts/
│   └── LanguageContext.jsx          # Language state management
├── translations/
│   └── index.js                     # UI label translations
├── utils/
│   └── propertyTranslations.js      # Property content translations
├── pages/
│   ├── Properties.jsx               # Property listing (uses translations)
│   ├── PropertyDetail.jsx           # Property details (uses translations)
│   ├── AdminPropertyPageAdd.jsx     # Admin form with Arabic fields
│   └── AdminPropertyPageEdit.jsx    # Admin edit form with Arabic fields
└── components/
    └── Navbar.jsx                   # Language toggle button
```

## Best Practices

1. **Always provide both English and Arabic** when creating properties
2. **Use consistent terminology** - Stick to the predefined amenity names
3. **Test after adding** - Always check both English and Arabic views
4. **Keep translations updated** - When adding new amenities/locations, add translations
5. **Right-to-Left (RTL)** - Arabic text fields have `dir="rtl"` for proper text direction

## Sample Property Translations

Here are some example property titles and descriptions in both languages:

### Villa in Saar
**English:**
- Title: "Spacious 4BR Villa in Saar - Private Pool"
- Description: "Beautiful standalone villa in the prestigious Saar district..."

**Arabic:**
- Title: "فيلا واسعة 4 غرف نوم في سار - مسبح خاص"
- Description: "فيلا جميلة مستقلة في منطقة سار المرموقة..."

### Apartment in Seef
**English:**
- Title: "Luxury 3BR Apartment in Seef - Sea View"
- Description: "Stunning 3-bedroom apartment with panoramic sea views..."

**Arabic:**
- Title: "شقة فاخرة 3 غرف نوم في السيف - إطلالة بحرية"
- Description: "شقة مذهلة بثلاث غرف نوم مع إطلالة بانورامية على البحر..."

## Support

If you encounter any issues with the translation system:

1. Check the browser console for errors
2. Verify the property has both `title` and `title_ar` fields in Firestore
3. Ensure the language toggle button is working in the navbar
4. Check that `dir="rtl"` is applied to Arabic text inputs

## Future Enhancements

Potential improvements:
- Auto-translation API integration (Google Translate API)
- Bulk translation tool in admin panel
- Translation management dashboard
- Multi-language support (add more languages)
- Translation quality checking

---

*Last Updated: 2025-10-19*
*Version: 1.0.0*
