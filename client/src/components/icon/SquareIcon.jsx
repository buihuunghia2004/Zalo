export default function SquareIcon({
  src,
  onClick,
  className
}) {
  return (
    <div 
      className={`size-10 p-2 rounded-lg hover:bg-zinc-950 ${className} `}
      onClick={onClick}
    >
      <img src={src}/>
    </div>
  )
}