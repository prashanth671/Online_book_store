export default function StarRating({ rating = 0, size = 'sm' }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const sz = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`${sz} ${i <= full ? 'star-filled' : i === full + 1 && half ? 'text-yellow-300' : 'star-empty'}`}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}
