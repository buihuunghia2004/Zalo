export default function SquareIcon({
  src,
  onClick,
  className
}) {
  return (
    <div 
      className={`size-10 p-2 rounded-lg hover:bg-slate-200 ${className} `}
      onClick={onClick}
    >
      <img src={src}/>
    </div>
  )
}