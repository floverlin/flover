const alertAudio = new Audio("alert.mp3");
export function playAlert() {
  if (!alertAudio.ended) {
    alertAudio.pause();
    alertAudio.currentTime = 0;
  }
  alertAudio.play();
}

export function avatarPath(avatar) {
  if (!avatar) return "/default.jpg";
  return `/uploads/public/${avatar}`;
}

export function imagePath(image) {
  if (!image) return "";
  return `/uploads/private/${image}`;
}

export function validateImageFile(file) {
  if (!file) return "Нет файла для отправки";
  if (file.size > 1024 * 1024 * 10) return "Файл слишком большой";
  if (!file.type.startsWith("image/"))
    return "Можно отправить только изображения";
}

export function scrollList(ref) {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
}

export async function waitAndScroll(ref) {
  await waitForImagesToLoad(ref);
  scrollList(ref);
}

function waitForImagesToLoad(containerRef) {
  return new Promise((resolve) => {
    if (!containerRef.current) {
      resolve();
      return;
    }

    const images = containerRef.current.querySelectorAll("img");
    if (images.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
        img.addEventListener("error", checkAllLoaded);
      }
    });
  });
}

export function formatTime(time) {
  const date = new Date(time);
  const now = new Date();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isSameDay) {
    return `${hours}:${minutes}`;
  } else if (isYesterday) {
    return `вчера ${hours}:${minutes}`;
  } else {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month} ${hours}:${minutes}`;
  }
}
