"use client";

interface EditorLoadingProps {
  barRef?: React.Ref<HTMLDivElement>;
}

const EditorLoading: React.FC<EditorLoadingProps> = ({ barRef }) => {
  const tips = [
    "Did you know? There are over 3,600 emojis in Unicode! 😎",
    "Fun fact: Emojis can express feelings faster than words 🎨",
    "The first emoji was created in 1999 by Shigetaka Kurita 🕹️",
    "Twemoji ensures emojis look the same on all devices 💻",
    "You can combine emojis to make new ‘emoji combos’ ✨",
    "Fun fact: There’s an emoji for almost everything — even a kiwi fruit 🥝",
    "Your editor is almost ready… ⏳",
    "Fun fact: Unicode adds new emojis every year 🌐",
    "Tip: Emojis can be used in creative ways — like mini-paintings 🎭",
    "Your editor is booting up… please wait 🔧",
    "Fun fact: Twemoji covers every emoji in the latest Unicode standard 📦",
    "Tip: A well-placed emoji can brighten any message 🌟",
    "Loading… almost there! 🚀",
    "Keep going! Your hard work is paying off 💪",
    "Dreams in progress… success is just around the corner 🌈",
    "You’re creating something amazing — stay inspired ✨",
    "Every great creation starts with small steps… you’re on the right track 🛤️",
    "Almost there! Your creativity will shine soon 🌟",
    "Hard work + emojis = unstoppable 💥",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="h-full flex flex-col justify-center items-center text-muted-foreground px-4">
      <div className="mb-4 text-center" suppressHydrationWarning>
        {randomTip}
      </div>

      <div className="w-full max-w-md h-6 bg-gray-300 rounded overflow-hidden relative">
        <div
          ref={barRef}
          className="h-6 bg-primary absolute left-0 top-0"
          style={{
            width: "0%",
            animation: "progressAnim 2s linear forwards",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-white">
          Loading…
        </div>
      </div>
    </div>
  );
};

export default EditorLoading;
