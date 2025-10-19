import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProperty, updateProperty } from "../data/firebaseService";
import { ArrowLeft, X } from "lucide-react";
import useAuth from "../hooks/useAuth";
import ImageUploadWithImgcoo from "../components/ImageUploadWithImgcoo";

const AdminPropertyPageEdit = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    slug: "",
    intent: "sale", // sale, rent
    type: "", // villa, apartment, townhouse, penthouse, etc.
    price: "",
    priceCadence: "/month", // /month, /year
    currency: "BHD", // BHD, USD, EUR, GBP
    status: "draft",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: "",
    featured: false,
    socialHousing: false,
    description: "",
    amenities: [],
    tags: [],
    priority: "",
    referenceCode: "",
    availableFrom: "",

    // Location
    location: {
      governorate: "",
      city: "",
      area: "",
      lat: "",
      lng: "",
    },

    // Specs
    specs: {
      bedrooms: "",
      bathrooms: "",
      furnishing: "", // furnished, unfurnished, semi-furnished
      ac: "", // centralized, split, vrf, other
      areaSqm: "",
      areaSqft: "",
      floor: "",
      parking: "",
      view: "",
      viewDetail: "",
      yearBuilt: "",
      classification: "", // RA, RB, RHA, RHB, SP, COMM, MIX, NA
    },

    // Lease Terms (for rentals)
    leaseTerms: {
      minMonths: "",
      depositMonths: "",
      commission: "",
      commissionNote: "",
    },

    // Agent Contact
    agentId: "",
    agentContact: {
      phone: "",
      whatsapp: "",
    },

    // Source
    source: {
      name: "",
      url: "",
    },
  });

  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const property = await getProperty(propertyId);

        if (!property) {
          alert("Property not found");
          navigate("/admin");
          return;
        }

        // Populate form with existing data
        setFormData({
          title: property.title || "",
          slug: property.slug || "",
          intent: property.intent || "sale",
          type: property.type || "",
          price: property.price || "",
          priceCadence: property.priceCadence || "/month",
          currency: property.currency || "BHD",
          status: property.status || "draft",
          ewaIncluded: property.ewaIncluded || false,
          priceInclusive: property.priceInclusive || false,
          ewaLimit: property.ewaLimit || "",
          featured: property.featured || false,
          socialHousing: property.socialHousing || false,
          description: property.description || "",
          amenities: property.amenities || [],
          tags: property.tags || [],
          priority: property.priority || "",
          referenceCode: property.referenceCode || "",
          availableFrom: property.availableFrom || "",
          location: {
            governorate: property.location?.governorate || "",
            city: property.location?.city || "",
            area: property.location?.area || "",
            lat: property.location?.lat || "",
            lng: property.location?.lng || "",
          },
          specs: {
            bedrooms: property.specs?.bedrooms || "",
            bathrooms: property.specs?.bathrooms || "",
            furnishing: property.specs?.furnishing || "",
            ac: property.specs?.ac || "",
            areaSqm: property.specs?.areaSqm || "",
            areaSqft: property.specs?.areaSqft || "",
            floor: property.specs?.floor || "",
            parking: property.specs?.parking || "",
            view: property.specs?.view || "",
            viewDetail: property.specs?.viewDetail || "",
            yearBuilt: property.specs?.yearBuilt || "",
            classification: property.specs?.classification || "",
          },
          leaseTerms: {
            minMonths: property.leaseTerms?.minMonths || "",
            depositMonths: property.leaseTerms?.depositMonths || "",
            commission: property.leaseTerms?.commission || "",
            commissionNote: property.leaseTerms?.commissionNote || "",
          },
          agentId: property.agentId || "",
          agentContact: {
            phone: property.agentContact?.phone || "",
            whatsapp: property.agentContact?.whatsapp || "",
          },
          source: {
            name: property.source?.name || "",
            url: property.source?.url || "",
          },
        });

        // Set existing images
        setImageUrls(property.images || []);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        alert("Failed to load property data");
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate]);

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
    } else if (name.startsWith("leaseTerms.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        leaseTerms: { ...prev.leaseTerms, [field]: value },
      }));
    } else if (name.startsWith("agentContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        agentContact: { ...prev.agentContact, [field]: value },
      }));
    } else if (name.startsWith("source.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        source: { ...prev.source, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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

  const handleAddTag = () => {
    const trimmed = tagsInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setTagsInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Property title is required");
      return;
    }

    if (imageUrls.length === 0) {
      alert("At least one image is required");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("🚀 Starting property update...");

      // Generate slug if not provided
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      // Clean up nested objects (remove empty strings)
      const cleanedSpecs = Object.fromEntries(
        Object.entries(formData.specs).filter(([_, v]) => v !== "")
      );

      const cleanedLocation = Object.fromEntries(
        Object.entries(formData.location).filter(([_, v]) => v !== "")
      );

      const cleanedLeaseTerms = Object.fromEntries(
        Object.entries(formData.leaseTerms).filter(([_, v]) => v !== "")
      );

      const cleanedAgentContact = Object.fromEntries(
        Object.entries(formData.agentContact).filter(([_, v]) => v !== "")
      );

      const cleanedSource = Object.fromEntries(
        Object.entries(formData.source).filter(([_, v]) => v !== "")
      );

      // Convert numeric strings to numbers
      const price = formData.price ? Number(formData.price) : 0;
      const ewaLimit = formData.ewaLimit ? Number(formData.ewaLimit) : null;
      const priority = formData.priority ? Number(formData.priority) : null;

      const propertyData = {
        ...formData,
        slug,
        price,
        ewaLimit,
        priority,
        specs: cleanedSpecs,
        location: cleanedLocation,
        leaseTerms: Object.keys(cleanedLeaseTerms).length > 0 ? cleanedLeaseTerms : null,
        agentContact: Object.keys(cleanedAgentContact).length > 0 ? cleanedAgentContact : null,
        source: Object.keys(cleanedSource).length > 0 ? cleanedSource : null,
        agentId: formData.agentId || null,
        availableFrom: formData.availableFrom || null,
        referenceCode: formData.referenceCode || null,
      };

      // Remove empty optional fields
      Object.keys(propertyData).forEach((key) => {
        if (propertyData[key] === "" || propertyData[key] === null) {
          delete propertyData[key];
        }
      });

      console.log("📋 Property data prepared:", propertyData);

      // Add image URLs to property data
      propertyData.images = imageUrls;

      await updateProperty(propertyId, propertyData, [], [], user); // Empty arrays since we're using URLs

      alert("✅ Property updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Failed to update property:", error);

      // Show more specific error message
      let errorMessage = "Failed to update property. ";

      if (error.code === "storage/unauthorized") {
        errorMessage += "You don't have permission to upload/delete images. Please check Firebase Storage rules.";
      } else if (error.code === "permission-denied") {
        errorMessage += "You don't have permission to update properties. Please check Firestore rules.";
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please check the console for details and try again.";
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-platinum-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold-primary border-r-transparent mb-4"></div>
          <p className="text-platinum-pearl/70">Loading property data...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-heading font-bold text-platinum-pearl">
                Edit Property
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Update the property details below
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
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
                    Price *
                  </label>
                  <input
                    type="number"
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
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  >
                    <option value="BHD">BHD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
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
                    <option value="/month">/month</option>
                    <option value="/year">/year</option>
                    <option value="">(None)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Priority (for sorting)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2, 3"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Reference Code
                  </label>
                  <input
                    type="text"
                    name="referenceCode"
                    value={formData.referenceCode}
                    onChange={handleInputChange}
                    placeholder="e.g., PR-SEF-001"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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

              <div className="mt-4 flex flex-wrap gap-6">
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
                    name="priceInclusive"
                    checked={formData.priceInclusive}
                    onChange={handleInputChange}
                    className="rounded border-gold-primary/20 bg-luxury-black/50 text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-platinum-pearl">Price Inclusive</span>
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

              {formData.ewaIncluded && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    EWA Limit (BHD)
                  </label>
                  <input
                    type="number"
                    name="ewaLimit"
                    value={formData.ewaLimit}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
                    className="w-full md:w-64 rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
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
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Manama, Riffa"
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
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
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
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    name="specs.areaSqft"
                    value={formData.specs.areaSqft}
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
                    <option value="centralized">Centralized</option>
                    <option value="split">Split</option>
                    <option value="vrf">VRF</option>
                    <option value="other">Other</option>
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
                    placeholder="e.g., sea, garden, city"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    View Detail
                  </label>
                  <input
                    type="text"
                    name="specs.viewDetail"
                    value={formData.specs.viewDetail}
                    onChange={handleInputChange}
                    placeholder="e.g., Full sea view facing north"
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
                  <select
                    name="specs.classification"
                    value={formData.specs.classification}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="RA">RA - Residential A</option>
                    <option value="RB">RB - Residential B</option>
                    <option value="RHA">RHA - Residential High-rise A</option>
                    <option value="RHB">RHB - Residential High-rise B</option>
                    <option value="SP">SP - Social/Public</option>
                    <option value="COMM">COMM - Commercial</option>
                    <option value="MIX">MIX - Mixed Use</option>
                    <option value="NA">NA - Not Applicable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
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

            {/* Tags */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
                Tags
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Add tag (e.g., sea-view, luxury, family-friendly)"
                  className="flex-1 rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-lg bg-gold-primary/20 px-6 py-3 text-sm font-semibold text-gold-primary hover:bg-gold-primary/30 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-400/50 hover:text-blue-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lease Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
                Lease Terms (for rentals)
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Minimum Lease (months)
                  </label>
                  <input
                    type="number"
                    name="leaseTerms.minMonths"
                    value={formData.leaseTerms.minMonths}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Deposit (months)
                  </label>
                  <input
                    type="number"
                    name="leaseTerms.depositMonths"
                    value={formData.leaseTerms.depositMonths}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 or 2"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Commission Paid By
                  </label>
                  <select
                    name="leaseTerms.commission"
                    value={formData.leaseTerms.commission}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="none">None</option>
                    <option value="tenant">Tenant Pays</option>
                    <option value="landlord">Landlord Pays</option>
                    <option value="split">Split</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Commission Note
                  </label>
                  <input
                    type="text"
                    name="leaseTerms.commissionNote"
                    value={formData.leaseTerms.commissionNote}
                    onChange={handleInputChange}
                    placeholder="e.g., Half month rent payable by tenant"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Agent & Source Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
                Agent & Source Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Agent ID
                  </label>
                  <input
                    type="text"
                    name="agentId"
                    value={formData.agentId}
                    onChange={handleInputChange}
                    placeholder="Internal agent identifier"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Agent Phone
                  </label>
                  <input
                    type="text"
                    name="agentContact.phone"
                    value={formData.agentContact.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +973 3333 1111"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Agent WhatsApp
                  </label>
                  <input
                    type="text"
                    name="agentContact.whatsapp"
                    value={formData.agentContact.whatsapp}
                    onChange={handleInputChange}
                    placeholder="e.g., +973 3333 1111"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    name="source.name"
                    value={formData.source.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Direct Owner, Property Portal"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-platinum-pearl mb-2">
                    Source URL
                  </label>
                  <input
                    type="url"
                    name="source.url"
                    value={formData.source.url}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com/property/123"
                    className="w-full rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gold-primary mb-4">
                Images *
              </h2>

              <ImageUploadWithImgcoo
                imageUrls={imageUrls}
                onImagesChange={setImageUrls}
              />
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
                {isSubmitting ? "Updating..." : "Update Property"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminPropertyPageEdit;
