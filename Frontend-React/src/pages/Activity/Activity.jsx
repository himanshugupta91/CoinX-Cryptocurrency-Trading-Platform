import TreadingHistory from '../Portfilio/TreadingHistory'
import { useTheme } from "@/context/ThemeContext";

const Activity = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 animate-fadeIn'>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
          Activity
        </h1>
        <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
          Your trading history
        </p>
      </div>

      <TreadingHistory />
    </div>
  )
}

export default Activity