import PreviewChat from "../components/PreviewChat";
import Scroller from "../components/Scroller";
import { THEMES } from "../lib/const";
import { useThemeStore } from "../store/useThemeStore";

export default function ColorsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Scroller>
      <div className="w-full md:w-2xl mx-auto rounded-xl py-4 md:py-8">
        <h3 className="text-center text-lg font-semibold mb-3">Предпросмотр</h3>
        <PreviewChat />

        <div className="flex flex-col items-center gap-1 mb-8">
          <p className="text-sm text-base-content/80">
            Выберите цветовую тему для интерфейса
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1 p-2 rounded-lg hover:cursor-pointer ${
                theme === t ? "bg-base-200" : "hover:bg-base-200/50"
              }`}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[10px] text-base-content/80 font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Scroller>
  );
}
