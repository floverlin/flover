import React, { useEffect } from "react";
import { useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

export default function InputPannel() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage, selectedChat, typing } = useChatStore();

  useEffect(() => {
    if (text === "") {
      typing(selectedChat._id, false);
    } else {
      typing(selectedChat._id, true);
    }
  }, [text, selectedChat, typing]);

  useEffect(() => {
    return () => {
      typing(selectedChat._id, false);
    };
  }, [selectedChat, typing]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 10) {
      toast.error("Файл слишком большой");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Можно отправить только изображения");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
    };
  }

  function removeImage() {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    removeImage();
  }

  return (
    <div className="min-h-14 w-full p-2 bg-accent/20 border-t-2 border-accent/30 relative">
      {imagePreview && (
        <div className="absolute left-2 -top-22 mb-2 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className="max-w-20 max-h-20 object-cover rounded-md shadow-black/40 shadow-xl"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 size-5 rounded-full bg-neutral flex items-center justify-center hover:scale-120 transition-all hover:cursor-pointer"
              type="button"
            >
              <X className="size-3 text-neutral-content" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          className="input w-full text-base"
          placeholder="Напишите сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`btn border-none px-2 bg-primary/60 flex items-center justify-center hover:text-primary-content transition-all ${
            imagePreview ? "text-primary-content" : "text-primary-content/40"
          }`}
          onClick={() => imageInputRef.current?.click()}
        >
          <Image className="size-4 md:size-6" />
        </button>
        <button
          onClick={() => {
            if (inputRef.current) inputRef.current.focus();
          }}
          type="submit"
          className="btn border-none px-3 bg-primary/60 flex items-center justify-center text-primary-content"
        >
          <Send className="size-4 md:size-6" />
        </button>
      </form>
    </div>
  );
}
