export default function FancySlider() {
  return (
    <form className="absolute inset-0 whitespace-nowrap overflow-hidden font-sans">
      {/* Radios */}
      <input
        type="radio"
        name="fancy"
        id="clubs"
        defaultChecked
        className="peer/clubs absolute"
      />
      <input
        type="radio"
        name="fancy"
        id="hearts"
        className="peer/hearts absolute"
      />
      <input
        type="radio"
        name="fancy"
        id="spades"
        className="peer/spades absolute"
      />
      <input
        type="radio"
        name="fancy"
        id="diamonds"
        className="peer/diamonds absolute"
      />

      {/* Slides */}
      <div className="relative flex transition-transform duration-400 ease-out
        peer-checked/hearts:-translate-x-[100vw]
        peer-checked/spades:-translate-x-[200vw]
        peer-checked/diamonds:-translate-x-[300vw]">

        <Slide label="♣ Create" bg="bg-neutral-700" />
        <Slide label="♥ Connect" bg="bg-red-700" />
        <Slide label="♠ Analyse" bg="bg-neutral-700" />
        <Slide label="♦ Execute" bg="bg-red-700" />
      </div>

      {/* Hint */}
      <div className="fixed bottom-0 inset-x-0 text-center p-4 text-white/80
        opacity-0 transition-opacity duration-300
        peer-focus:opacity-80">
        Use left and right keys to navigate
      </div>
    </form>
  );
}


function Slide({ label, bg }: { label: string; bg: string }) {
  return (
    <label
      className={`relative flex items-center justify-center 
      w-screen h-screen text-5xl text-white ${bg}
      cursor-pointer select-none`}
    >
      {label}

      {/* Left Arrow */}
      <span className="absolute left-full top-1/2 -translate-y-1/2
        bg-white/20 text-white text-4xl px-4 py-8 rounded-r-full">
        ❬
      </span>

      {/* Right Arrow */}
      <span className="absolute right-full top-1/2 -translate-y-1/2
        bg-white/20 text-white text-4xl px-4 py-8 rounded-l-full">
        ❭
      </span>
    </label>
  );
}