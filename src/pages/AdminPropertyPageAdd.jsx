import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../data/firebaseService";
import { ArrowLeft, Upload, X } from "lucide-react";

const AdminPropertyPageAdd = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    slug: "",
    intent: "sale", // sale, rent
    type: "", // villa, apartment, townhouse, penthouse, etc.
    price: "",
    priceCadence: "monthly", // monthly, yearly (for rent)
    ewaIncluded: false,
    featured: false,
    socialHousing: false,
    description: "",
    amenities: [],

    // Location
    location: {
      governorate: "",
      area: "",
      lat: "",
      lng: "",
    },

    // Specs
    specs: {
      bedrooms: "",
      bathrooms: "",
      furnishing: "", // furnished, unfurnished, semi-furnished
      ac: "", // central, split, none
      areaSqm: "",
      floor: "",
      parking: "",
      view: "",
      yearBuilt: "",
      classification: "", // A+, A, B, C, etc.
    },
  });

  const [amenitiesInput, setAmenitiesInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (name.startsWith("specs.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specs: { ...prev.specs, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Add new files to existing ones
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    const trimmed = amenitiesInput.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, trimmed],
      }));
      setAmenitiesInput("");
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Property title is required");
      return;
    }

    if (imageFiles.length === 0) {
      alert("At least one image is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Generate slug if not provided
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      // Clean up specs (remove empty strings)
      const cleanedSpecs = Object.fromEntries(
        Object.entries(formData.specs).filter(([_, v]) => v !== "")
      );

      // Clean up location
      const cleanedLocation = Object.fromEntries(
        Object.entries(formData.location).filter(([_, v]) => v !== "")
      );

      const propertyData = {
        ...formData,
        slug,
        specs: cleanedSpecs,
        location: cleanedLocation,
      };

      await createProperty(propertyData, imageFiles);

      alert("Property created successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to create property:", error);
      alert("Failed to create property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
        </div>

        <div className="relative container px-4 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="rounded-full p-2 text-gold-primary transition hover:bg-gold-primary/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-serif font-bold text-platinum-pearl">
                Add New Property
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Fill in the details below to create a new property listing
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gold-primary mb-4">
                Basic Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Slug (URL-friendly)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Intent *
                  </label>
                  <select
                    name="intent"
                    value={formData.intent}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Property Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Villa, Apartment, Townhouse"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Price (BHD) *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 295000 or 1200"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Price Cadence (for rent)
                  </label>
                  <select
                    name="priceCadence"
                    value={formData.priceCadence}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                />
              </div>

              <div className="mt-4 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ewaIncluded"
                    checked={formData.ewaIncluded}
                    onChange={handleInputChange}
                    className="rounded border-gold-primary/20 bg-luxury-black/50 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-platinum-pearl">EWA Included</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gold-primary/20 bg-luxury-black/50 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-platinum-pearl">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="socialHousing"
                    checked={formData.socialHousing}
                    onChange={handleInputChange}
                    className="rounded border-gold-primary/20 bg-luxury-black/50 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-platinum-pearl">Social Housing</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gold-primary mb-4">
                Location
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Governorate
                  </label>
                  <input
                    type="text"
                    name="location.governorate"
                    value={formData.location.governorate}
                    onChange={handleInputChange}
                    placeholder="e.g., Muharraq, Capital"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    name="location.area"
                    value={formData.location.area}
                    onChange={handleInputChange}
                    placeholder="e.g., Amwaj Islands, Juffair"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="location.lat"
                    value={formData.location.lat}
                    onChange={handleInputChange}
                    placeholder="e.g., 26.2361"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="location.lng"
                    value={formData.location.lng}
                    onChange={handleInputChange}
                    placeholder="e.g., 50.5831"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gold-primary mb-4">
                Specifications
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="specs.bedrooms"
                    value={formData.specs.bedrooms}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="specs.bathrooms"
                    value={formData.specs.bathrooms}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Area (sqm)
                  </label>
                  <input
                    type="number"
                    name="specs.areaSqm"
                    value={formData.specs.areaSqm}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Furnishing
                  </label>
                  <select
                    name="specs.furnishing"
                    value={formData.specs.furnishing}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="furnished">Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Air Conditioning
                  </label>
                  <select
                    name="specs.ac"
                    value={formData.specs.ac}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="central">Central AC</option>
                    <option value="split">Split AC</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Floor
                  </label>
                  <input
                    type="text"
                    name="specs.floor"
                    value={formData.specs.floor}
                    onChange={handleInputChange}
                    placeholder="e.g., 3rd, Ground"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Parking
                  </label>
                  <input
                    type="text"
                    name="specs.parking"
                    value={formData.specs.parking}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 spaces, Underground"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    View
                  </label>
                  <input
                    type="text"
                    name="specs.view"
                    value={formData.specs.view}
                    onChange={handleInputChange}
                    placeholder="e.g., Sea view, Garden view"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    name="specs.yearBuilt"
                    value={formData.specs.yearBuilt}
                    onChange={handleInputChange}
                    placeholder="e.g., 2020"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Classification
                  </label>
                  <input
                    type="text"
                    name="specs.classification"
                    value={formData.specs.classification}
                    onChange={handleInputChange}
                    placeholder="e.g., A+, A, B"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gold-primary mb-4">
                Amenities
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                  placeholder="Add amenity (e.g., Swimming Pool, Gym)"
                  className="flex-1 rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="rounded-lg bg-gold-primary/20 px-6 py-3 text-sm font-semibold text-gold-primary hover:bg-gold-primary/30 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-gold-primary/10 px-4 py-2 text-sm text-platinum-pearl"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="text-platinum-pearl/50 hover:text-platinum-pearl"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gold-primary mb-4">
                Images *
              </h2>

              <div className="mb-4">
                <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold-primary/30 bg-luxury-black/50 px-6 py-8 cursor-pointer hover:border-gold-primary/50 transition">
                  <Upload className="h-6 w-6 text-gold-primary" />
                  <span className="text-platinum-pearl">
                    Click to upload images (multiple)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex-1 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminPropertyPageAdd;
