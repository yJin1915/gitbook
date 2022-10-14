
import pdfs from "./user_manual.pdf"; // 这里直接引入的pdf文件


const  Manual = () => {
  return  <iframe src={pdfs} style={{width:'100%',height:'100%'}}></iframe>
}

export default Manual