
const Container = ({children , className}) => {
    return (
        <div className={`max-w-[330 mx-auto ${className}`}>{children}</div>
    )
}

export default Container