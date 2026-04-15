import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function DateComponent({ dateString }: { dateString: string | undefined }) {
	if (!dateString) {
		return null
	}

	return (
		<time dateTime={dateString} className=''>
			{format(new Date(dateString), 'LLLL	d, yyyy', { locale: pl })}
		</time>
	)
}
