export default function Spinner({ text = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="spinner" />
        <p className="text-gray-400 text-sm font-medium">{text}</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="spinner" />
      <p className="text-gray-400 text-sm font-medium">{text}</p>
    </div>
  )
}
