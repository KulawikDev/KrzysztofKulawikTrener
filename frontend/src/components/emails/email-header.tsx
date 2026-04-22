import { Column, Img, Row, Section, Text } from '@react-email/components'
import { BASE_URL } from '@/lib/base-url'

type Props = {
	title: string
	subtitle: string
	titleColor?: string
}

// Pattern opacity is achieved by layering:
//   outer Section  → pattern background image
//   inner Column   → rgba overlay that dims the pattern
// This is the standard email-compatible opacity technique (no CSS opacity on bg-image).

export const EmailHeader = ({ title, subtitle, titleColor = '#EBEBEB' }: Props) => (
	<Section
		className='border-b-2 border-[#FFC902] text-center'
		style={{
			backgroundColor: '#191919',
			backgroundImage: `url(https://krzysztofkulawik.pl/images/pattern.png)`,
			backgroundRepeat: 'repeat',
			backgroundSize: '200px'
		}}>
		<Row>
			<Column className='px-10 pt-12 pb-10' style={{ backgroundColor: 'rgba(25, 25, 25, 0.78)' }}>
				<Img
					src={`${BASE_URL}/assets/wordmark-white.png`}
					alt='Krzysztof Kulawik'
					width={148}
					height={62}
					className='mx-auto mb-7 block'
				/>
				<Text
					className='m-0 text-[38px] leading-[1.1] font-black tracking-[-1px] uppercase'
					style={{ color: titleColor, whiteSpace: 'pre-line' }}>
					{title}
				</Text>
				<Text className='m-0 mt-4 text-[14px] text-[#AAAAAA]'>{subtitle}</Text>
			</Column>
		</Row>
	</Section>
)
