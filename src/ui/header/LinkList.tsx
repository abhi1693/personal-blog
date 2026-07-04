import Dropdown from './Dropdown'

export default function LinkList(
	props: Sanity.LinkList & { summaryClassName?: string },
) {
	return <Dropdown {...props} />
}
