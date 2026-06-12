
const Button = ({ btnText, className }) => {
    return (
        <button className={`cursor-pointer duration-500 ${className}`}>{btnText}</button>
    )
}

export default Button