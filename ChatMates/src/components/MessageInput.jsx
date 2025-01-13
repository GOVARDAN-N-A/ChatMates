import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Gift } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPanel, setShowGifPanel] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);  
    };
    reader.readAsDataURL(file);  
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,  // Send the Base64 image
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleGifSelect = (gif) => {
    // Handle GIF selection - you'll need to integrate with a GIF API like GIPHY
    setImagePreview(gif.url);
    setShowGifPanel(false);
  };

  return (
    <div className="p-4 w-full relative">
      {/* Image Preview */}
      {imagePreview && (
        <div className="flex flex-col items-center mb-2">
          <img src={imagePreview} alt="Image Preview" className="w-24 h-24 object-cover rounded-md" />
          <button 
            type="button"
            className="text-red-500 mt-2"
            onClick={removeImage}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex flex-wrap items-center gap-2">
        <div className="flex-1 flex gap-2 relative w-full">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Emoji Picker Button */}
          <button
            type="button"
            className="btn btn-circle btn-sm sm:btn-md"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>

          {/* GIF Button */}
          <button
            type="button"
            className="btn btn-circle btn-sm sm:btn-md"
            onClick={() => setShowGifPanel(!showGifPanel)}
          >
            <Gift size={20} />
          </button>

          {/* Image Upload Button */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-sm sm:btn-md ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle sm:btn-md"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {/* Emoji Picker Panel */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-0 w-full max-w-[300px]">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme="dark"
            width={300}
            height={400}
          />
        </div>
      )}

      {/* GIF Panel */}
      {showGifPanel && (
        <div className="absolute bottom-20 left-0 bg-base-300 rounded-lg p-4 w-[300px] h-[400px] overflow-y-auto">
          {/* Integrate your preferred GIF API here */}
          {/* Example: GIPHY, Tenor, etc. */}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
