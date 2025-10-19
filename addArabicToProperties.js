/**
 * Add Arabic translations to existing properties
 * This script updates all properties in Firestore to include Arabic translations
 *
 * Usage: node addArabicToProperties.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample Arabic translations for common property titles and descriptions
// You can expand this list or modify it based on your properties
const sampleTranslations = {
  // Seef properties
  "Luxury 3BR Apartment in Seef - Sea View": {
    title_ar: "شقة فاخرة 3 غرف نوم في السيف - إطلالة بحرية",
    description_ar: "شقة مذهلة بثلاث غرف نوم مع إطلالة بانورامية على البحر في قلب السيف. تتميز هذه الإقامة الحديثة بنوافذ ممتدة من الأرض إلى السقف، وتشطيبات معاصرة، والوصول إلى وسائل الراحة الممتازة في المبنى بما في ذلك صالة رياضية ومسبح وأمن على مدار الساعة. مثالي للمهنيين والعائلات الباحثين عن حياة فاخرة."
  },
  "Investment Opportunity - 2BR Apartment Seef": {
    title_ar: "فرصة استثمارية - شقة غرفتين نوم السيف",
    description_ar: "فرصة استثمارية ممتازة في منطقة السيف. توفر هذه الشقة المكونة من غرفتي نوم عوائد إيجارية قوية في موقع متميز. مؤجرة حاليًا مع مستأجرين جيدين. مثالي للمستثمرين الذين يتطلعون إلى توسيع محفظة عقاراتهم في منطقة ذات طلب مرتفع."
  },

  // Saar properties
  "Spacious 4BR Villa in Saar - Private Pool": {
    title_ar: "فيلا واسعة 4 غرف نوم في سار - مسبح خاص",
    description_ar: "فيلا جميلة مستقلة في منطقة سار المرموقة. تتميز بـ 4 غرف نوم واسعة ومطبخ حديث ومسبح خاص وحديقة ذات مناظر طبيعية. مثالية للعائلات التي تبحث عن منطقة سكنية هادئة مع مدارس ممتازة قريبة."
  },

  // Juffair properties
  "Modern Studio in Juffair - Fully Furnished": {
    title_ar: "استوديو عصري في الجفير - مفروش بالكامل",
    description_ar: "شقة استوديو مريحة وعصرية في منطقة الجفير النابضة بالحياة. مفروشة بالكامل بأثاث معاصر، ومطبخ مجهز، والوصول إلى وسائل الراحة في المبنى. على بعد مسافة قصيرة سيرًا على الأقدام من المطاعم والمقاهي ومراكز التسوق. مثالي للمهنيين الشباب والوافدين."
  },

  // Diplomatic Area properties
  "Prime Commercial Office in Diplomatic Area": {
    title_ar: "مكتب تجاري مميز في المنطقة الدبلوماسية",
    description_ar: "مساحة مكتبية متميزة في المنطقة الدبلوماسية المرموقة. يتميز بتجهيزات حديثة ونوافذ بانورامية ومواقف سيارات مخصصة ووصول على مدار الساعة. مثالي للمكاتب الشركات وشركات الاستشارات والخدمات المهنية. على مسافة قريبة من الوزارات الحكومية والسفارات."
  },

  // Mahooz properties
  "Affordable 2BR Social Housing - Mahooz": {
    title_ar: "إسكان اجتماعي بأسعار معقولة - غرفتين نوم - المحوز",
    description_ar: "شقة من غرفتي نوم نظيفة وصيانتها جيدة في المحوز، مناسبة للعائلات ضمن برنامج الإسكان الاجتماعي. تتميز بغرف واسعة وتصميم مناسب للعائلات ووصول مريح إلى المدارس والأسواق المحلية. محجوزة للعائلات البحرينية المؤهلة."
  },

  // Amwaj properties
  "Exclusive Penthouse in Amwaj Islands": {
    title_ar: "بنتهاوس حصري في جزر أمواج",
    description_ar: "بنتهاوس فائق الفخامة مع إطلالات بانورامية خلابة على البحر في جزر أمواج. تتميز هذه التحفة الفنية بـ 4 غرف نوم مع حمامات داخلية، تراس خاص على السطح مع مسبح لا متناهي، مطبخ حديث، وتشطيبات فاخرة في جميع أنحاء المكان. حياة جزرية حصرية في أفضل حالاتها."
  },

  // Riffa properties
  "Spacious 3BR Townhouse in Riffa Views": {
    title_ar: "منزل واسع 3 غرف نوم في مناظر الرفاع",
    description_ar: "منزل عصري في مجتمع مناظر الرفاع المسور الملائم للعائلات. يتميز بـ 3 غرف نوم، غرفة خادمة، حديقة خاصة، والوصول إلى مرافق المجتمع بما في ذلك مسبح، صالة رياضية، ومناطق لعب الأطفال. مثالي للعائلات التي تبحث عن بيئة آمنة وخضراء."
  },
};

async function addArabicTranslations() {
  console.log('🌍 Adding Arabic translations to properties...\n');

  try {
    // Get all properties
    const propertiesSnapshot = await db.collection('properties').get();
    const totalProperties = propertiesSnapshot.size;

    console.log(`📊 Found ${totalProperties} properties\n`);

    let updated = 0;
    let skipped = 0;

    for (const doc of propertiesSnapshot.docs) {
      const property = doc.data();
      const propertyTitle = property.title;

      // Check if property already has Arabic translation
      if (property.title_ar && property.description_ar) {
        console.log(`⏭️  Skipped: "${propertyTitle}" (already has Arabic)`);
        skipped++;
        continue;
      }

      // Check if we have a translation for this property
      const translation = sampleTranslations[propertyTitle];

      if (translation) {
        // Update with Arabic translation
        await db.collection('properties').doc(doc.id).update({
          title_ar: translation.title_ar,
          description_ar: translation.description_ar,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`✅ Updated: "${propertyTitle}"`);
        console.log(`   AR: "${translation.title_ar}"`);
        updated++;
      } else {
        // Property doesn't have a translation in our list
        console.log(`⚠️  No translation: "${propertyTitle}"`);
        console.log(`   You'll need to add Arabic manually for this property`);
        skipped++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total properties: ${totalProperties}`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 TIP: To translate remaining properties:');
    console.log('1. Go to Admin panel → Properties');
    console.log('2. Edit each property');
    console.log('3. Add Arabic title and description\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

addArabicTranslations();
