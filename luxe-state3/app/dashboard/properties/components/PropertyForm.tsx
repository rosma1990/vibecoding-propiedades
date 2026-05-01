"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProperty, updateProperty, uploadPropertyImage, Property } from "../../../../lib/properties";

interface PropertyFormProps {
  initialData?: Property;
}

export function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [status, setStatus] = useState(() => {
    if (initialData?.badge === 'Sold') return 'sold';
    if (initialData?.type === 'rent') return 'for-rent';
    return 'for-sale';
  });
  const [propertyType, setPropertyType] = useState(initialData?.property_type || "apartment");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [area, setArea] = useState(initialData?.area || "");
  const [yearBuilt, setYearBuilt] = useState(initialData?.year_built || "");
  const [beds, setBeds] = useState(initialData?.beds || 0);
  const [baths, setBaths] = useState(initialData?.baths || 0);
  const [parking, setParking] = useState(initialData?.parking || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [uploadingImages, setUploadingImages] = useState(false);

  const availableAmenities = [
    "Swimming Pool", "Garden", "Air Conditioning", "Smart Home", 
    "Gym", "Balcony", "Security", "Parking"
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImages(true);
    const newImages = [...images];
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const url = await uploadPropertyImage(file);
      if (url) {
        newImages.push(url);
      }
    }
    
    setImages(newImages);
    setUploadingImages(false);
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isRent = status === 'for-rent';
    const isSold = status === 'sold';
    
    const dbType = isRent ? 'rent' : 'sale';
    const dbBadge = isSold ? 'Sold' : null;

    const propertyData = {
      title,
      price: price.toString(),
      type: dbType as 'sale' | 'rent',
      badge: dbBadge,
      property_type: propertyType,
      description,
      location,
      area: area.toString(),
      year_built: yearBuilt ? parseInt(yearBuilt.toString()) : undefined,
      beds: parseInt(beds.toString()),
      baths: parseInt(baths.toString()),
      parking: parseInt(parking.toString()),
      images,
      amenities,
      slug: initialData?.slug || generateSlug(title)
    };

    try {
      if (initialData?.id) {
        await updateProperty(initialData.id, propertyData);
      } else {
        await createProperty(propertyData);
      }
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to save property', error);
      alert('Failed to save property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div className="xl:col-span-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic-dark">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-nordic-dark mb-1.5 font-sf-pro" htmlFor="title">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro" 
                id="title" 
                placeholder="e.g. Modern Penthouse with Ocean View" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-nordic-dark mb-1.5 font-sf-pro" htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro" 
                    id="price" 
                    placeholder="0.00" 
                    type="number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic-dark mb-1.5 font-sf-pro" htmlFor="status">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" 
                  id="status"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nordic-dark mb-1.5 font-sf-pro" htmlFor="type">Property Type</label>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" 
                  id="type"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic-dark">Description</h2>
          </div>
          <div className="p-8">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]" 
              id="description" 
              placeholder="Describe the property features, neighborhood, and unique selling points..."
            />
            <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
              {description.length} / 2000 characters
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-of-green/30 flex justify-between items-center bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic-dark">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div 
              className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-of-green/10 hover:border-mosque/40 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden" 
                multiple 
                type="file" 
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">{uploadingImages ? 'hourglass_empty' : 'cloud_upload'}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic-dark font-sf-pro">
                    {uploadingImages ? 'Uploading...' : 'Click or drag images here'}
                  </p>
                  <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {images.map((img, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                  <img alt="Property" className="w-full h-full object-cover" src={img} />
                  <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic-dark">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nordic-dark mb-1.5 font-sf-pro" htmlFor="location">Address</label>
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" 
                id="location" 
                placeholder="Street Address, City, Zip" 
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic-dark">Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">Area (m²)</label>
                <input 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" 
                  id="area" 
                  placeholder="0" 
                  type="number"
                />
              </div>
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year">Year Built</label>
                <input 
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" 
                  id="year" 
                  placeholder="YYYY" 
                  type="number"
                />
              </div>
            </div>
            <hr className="border-gray-100" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBeds(Math.max(0, beds - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={beds} />
                  <button type="button" onClick={() => setBeds(beds + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBaths(Math.max(0, baths - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={baths} />
                  <button type="button" onClick={() => setBaths(baths + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setParking(Math.max(0, parking - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium font-sf-pro" readOnly type="text" value={parking} />
                  <button type="button" onClick={() => setParking(parking + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-sm font-bold text-nordic-dark mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
              <div className="space-y-2">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" 
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic-dark transition-colors">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
        <button 
          type="button" 
          onClick={() => router.push('/dashboard')}
          className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic-dark font-medium font-sf-pro"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Desktop Hidden Save Button to submit form when pressing enter */}
      <button type="submit" className="hidden">Submit</button>
    </form>
  );
}
