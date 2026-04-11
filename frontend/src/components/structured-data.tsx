type Props = {
	data: {
		[key: string]: any
	}
}

export const StructuredData = ({ data }: Props) => {
	return (
		<script
			key='structured-data'
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
