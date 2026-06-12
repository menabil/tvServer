import Button from "../Button"
import { Link } from "react-router-dom"

const Error = () => {
    return (
        <div className="relative">
            {/* <Images imgSrc={} className={'mx-auto mt-[100px]'}/> */}
            <div className="errorBtn text-center absolute left-[50%] -translate-x-[50%] bottom-[70px] ">
                <Link to={"/"}>
                    <Button btnText={"Back To Homepage"} className={"duration-300"} />
                </Link>
            </div>
        </div>
    )
}

export default Error