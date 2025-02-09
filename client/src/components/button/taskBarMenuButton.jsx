export default function TaskBarMenuButton({
  onClick,
  className,
  imgActive,
  imgInActive,
  isActive
}) {
  return (
    <div className={`${className} hover:bg-blue-800 p-2 rounded-md ${isActive && "bg-blue-800"}`} onClick={(e)=>onClick(e)}>
      <img
          className="size-8 align-middle"
          src={isActive ?  imgActive : imgInActive}
          alt="Placeholder"
        />
    </div>
  )
}