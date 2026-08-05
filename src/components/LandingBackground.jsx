import bgImage from '../assets/landing-page-background.webp'

function LandingBackground({ children }) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="relative">{children}</div>
    </div>
  )
}

export default LandingBackground
