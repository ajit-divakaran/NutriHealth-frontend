import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PageNotFound = () => {
  const navigate = useNavigate()
  useEffect(()=>{

    toast.warning('Redirecting to Home page')
    setTimeout(()=>navigate('/'),9650)
  },[])
  return (
    <div className='flex justify-center' style={{boxSizing:'border-box'}}>
    
           <div className='w-[85%] h-[100vh] flex flex-col items-center'>
                <img src="https://img.freepik.com/free-vector/404-error-page-found_24908-59520.jpg?ga=GA1.1.435052462.1729684162&semt=ais_hybrid" alt="no image" width='40%' className='mt-8'/>
              <div>
                    <h1 className='text-center'>Looks like you're lost</h1>
                    <h5>The page you are looking is unavailable</h5>
                    <div className='flex justify-center'><buttton className="bg-green-400 mt-3 px-4 py-3 hover:bg-[#f88065] hover:cursor-pointer  rounded-md w-auto " onClick={()=>navigate('/')}>Go Home</buttton></div>
              </div>
           </div>
           <ToastContainer theme='dark' position="top-center" autoClose={9500}/>
    
</div>
  )
}

export default PageNotFound