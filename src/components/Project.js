import '../css/project.css'
import photo from "../../static/img/seniorprojectphoto.jpg"

function Project(){
    return (
        <div className="main">
            <div className='teamPhoto'>
                <img src={photo}></img>
            </div>
            <div className="text">
                The “2D Converter” project aims to transform 2D artifacts and technical drawings into 3D mesh models. 
                The 2D artifacts can take a variety of formats, including: Paper, Mylar, and Soft copy. To convert the 
                existing 2D artifacts, a deep learning solution will be utilized. Alongside that, a GUI mainly used by 
                engineers will be designed and implemented to ingest and visualize artifacts. The application will 
                leverage several AWS technologies to develop a proof of concept of the 2D to 3D mesh generation.
            </div>
        </div>
    )
}

export default Project