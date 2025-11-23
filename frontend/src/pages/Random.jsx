import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Random = () => {
  const { id } = useParams(); // get property id from route
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // fetch existing property to prefill form
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`https://prod-real-estate-backend.onrender.com/property/${id}`, {
          withCredentials: true,
        });
        reset(res.data); // prefill fields
        setImagePreview(res.data.imageUrl);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };
    fetchProperty();
  }, [id, reset]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = imagePreview; // keep old image if not replaced

      if (data.image && data.image[0]) {
        const base64Image = await convertToBase64(data.image[0]);
        const uploadRes = await axios.post(
          "https://prod-real-estate-backend.onrender.com/upload",
          { image: base64Image },
          { withCredentials: true }
        );
        imageUrl = uploadRes.data.url;
      }

      const res = await axios.put(
        `https://prod-real-estate-backend.onrender.com/property/${id}`,
        { ...data, price: parseFloat(data.price), imageUrl },
        { withCredentials: true }
      );

      console.log("Property updated:", res.data);
      setUploading(false);
      navigate("/dashboard"); // redirect after update
    } catch (error) {
      console.error("Error updating:", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-md rounded-xl space-y-4 w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-10 text-center text-blue-600">
          Edit Property
        </h2>

        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <textarea
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <input
          type="number"
          placeholder="Price"
          {...register("price", { required: "Price is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <input
          type="text"
          placeholder="Location"
          {...register("location", { required: "Location is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="border p-2 w-full rounded"
          onChange={(e) => {
            if (e.target.files[0]) {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />

        {imagePreview && (
          <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded" />
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {uploading ? "Updating..." : "Update Property"}
        </button>
      </form>
    </div>
  );
};

export default Random;
