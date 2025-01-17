import React, { useState, useEffect } from "react";
import { Camera, User, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import Compressor from "compressorjs";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    email: authUser?.email || "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    // Compress the image
    new Compressor(file, {
      quality: 0.8,
      success: (compressed) => {
        setCompressedFile(compressed); // Save the compressed file
        const objectURL = URL.createObjectURL(compressed);
        setSelectedImage(objectURL); // Update the preview
      },
      error: (err) => {
        console.error("Compression error:", err);
        toast.error("Failed to compress the image. Please try again.");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      // Convert compressed file to base64 if needed
      let base64Image = null;
      if (compressedFile) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          
        });
      }
      console.log("base64Image", base64Image);
      

      await updateProfile({
        fullname: formData.fullname,
        email: formData.email,
        profilePic: base64Image || authUser.profilePic, // Use the new image or fallback to the old one
        
      });
      
      // toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-base-content/60">Update your profile</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImage ||
                  authUser.profilePic ||
                  "https://img.freepik.com/premium-vector/child-avatar-illustration-happy-boy-avatar-cartoon-user-portrait-user-profile-icon_118339-4378.jpg?w=1380"
                }
                alt="Profile Picture"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label
                htmlFor="pic-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="pic-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isUpdatingProfile}
            className={`mt-6 w-full bg-primary text-white py-2.5 rounded-lg ${
              isUpdatingProfile ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUpdatingProfile ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
