import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch existing property data on load
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/property/${propertyId}`,
          {
            withCredentials: true,
          }
        );

        const property = res.data;

        // Populate the form with existing data
        reset({
          title: property.title ?? "",
          description: property.description ?? "",
          price: property.price ?? "",
          location: property.location ?? "",
        });

        // Set the initial image preview
        setImagePreview(property.imageUrl);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };

    fetchProperty();
  }, [propertyId, reset]);

  // Helper to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = imagePreview; // Default to existing image

      // If a new image file is selected, upload it
      if (data.image && data.image[0]) {
        const base64Image = await convertToBase64(data.image[0]);
        const uploadRes = await axios.post(
          "http://localhost:3000/upload",
          { image: base64Image },
          { withCredentials: true }
        );
        imageUrl = uploadRes.data.url;
      }

      const payload = {
        title: data.title,
        description: data.description,
        price: parseInt(data.price),
        location: data.location,
        imageUrl,
      };

      // Send PUT request to update
      await axios.put(`http://localhost:3000/property/${propertyId}`, payload, {
        withCredentials: true,
      });

      setUploading(false);
      navigate("/myproperty"); // Go back to my properties list
    } catch (error) {
      console.error("Error updating:", error);
      setUploading(false);
    }
  };

  // Split 'register' for image to merge onChange
  const { onChange: onImageChange, ...imageRest } = register("image");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 sm:p-8 bg-white shadow-xl rounded-2xl space-y-5 w-full max-w-lg border border-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4">
            ✏️
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Update Property
          </h2>
          <p className="text-gray-500 mt-1">Make changes to your listing.</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g. Modern 2-Bedroom Condo"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="A brief description of the property..."
            {...register("description", { required: "Description is required" })}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Price & Location Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              placeholder="0.00"
              {...register("price", { required: "Price is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Miami, FL"
              {...register("location", { required: "Location is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Image (Optional)</label>
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer ${
              imagePreview ? 'p-0' : 'p-6'
            } bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-semibold text-indigo-600">Upload new image</span>
                </p>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            {...imageRest}
            className="hidden"
            onChange={(e) => {
              onImageChange(e); // Propagate change to react-hook-form
              if (e.target.files && e.target.files[0]) {
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          <p className="text-xs text-gray-400 mt-1">Leave blank to keep existing image.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/myproperty")}
            className="w-1/3 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="w-2/3 flex justify-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-400 disabled:cursor-wait"
          >
            {uploading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProperty;