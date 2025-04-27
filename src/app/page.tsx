import Image from 'next/image'

const images = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.png', '/images/6.jpg']

export default function Home() {
	return (
		<div className='relative min-h-screen bg-black flex items-center justify-center overflow-hidden'>
			{/* Background Images */}
			<div className='absolute inset-0 z-0 pointer-events-none'>
				<div className='w-full h-full flex flex-wrap justify-center items-center opacity-50'>
					{images.map((src, i) => (
						<div key={i} className={`relative m-4 w-40 h-40 transform ${randomRotation()} transition-all duration-500`}>
							<Image src={src} alt={`bg-${i}`} width={500} height={800} className='rounded-lg shadow-lg' />
						</div>
					))}
				</div>
			</div>

			{/* Foreground Text */}
			<div className='z-10 text-center p-8'>
				<h1 className='text-white text-4xl md:text-6xl font-bold mb-4 lg:text-8xl xl:text-9xl'>CUMING SOON</h1>
				<p className='text-gray-300 text-lg md:text-2xl'>krzysztofkulawik.pl - zakolax nadciąga</p>
			</div>
		</div>
	)
}

function randomRotation() {
	const rotations = ['rotate-3', '-rotate-6', 'rotate-12', '-rotate-3', 'rotate-6', '-rotate-12']
	return rotations[Math.floor(Math.random() * rotations.length)]
}
