export default function TextPage(props) {
    const nArr = props.pages.filter(page => (page.uid === props.id))

    return (
        <div>
            {nArr && nArr[0].content}
        </div>
    )
}