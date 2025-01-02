import { useContext, useState } from "react";
import { LoginApi, RegisterApi } from "../services/allApis";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { shareUserDetails } from "../context/ContextShare";

const LoginPage = ({login}) => {
  const [userDetails,setUserDetails] = useState({
    username:"",
    email:"",
    password:""
  })

 

  const navigate = useNavigate()

  console.log(userDetails)

  const handleRegister = async()=>{
    
    const {username,email,password} = userDetails
    
    if(!username || !email || !password){
      toast.info("Please enter full details")
    }
    else{

      const result = await RegisterApi(userDetails)
      console.log(result.data)
      if(result.status==200){
        toast.success('Registered successfully')
        setUserDetails({
          username:"",
          email:"",
          password:""
        })
        navigate('/login')
      }
      else if(result.status == 406){
        toast.info(result.response.data)
        setUserDetails({
          username:"",
          email:"",
          password:""
        })
      }
      else{
        toast.error("Something went wrong")
        setUserDetails({
          username:"",
          email:"",
          password:""
        })
      }
    }
  }

  const handleLogin = async() =>{
    const {email,password} = userDetails;

    if(!email || !password){
      toast.info('Please fill the form completely')
    }
    else{
      const result = await LoginApi({email,password})
      console.log(result.data)
      if(result.status==200){
        toast.success("Login Successful")
        setUserDetails({
          username:"",
          email:"",
          password:""
        })
        sessionStorage.setItem('existingUser',JSON.stringify(result.data.existingUser))
        sessionStorage.setItem('token',result.data.token)
        // setLoginResponse(true)
        setTimeout(()=>{navigate('/goals')},2000)
        
      }
      else if(result.status==406){
        toast.warning(result.response.data)
      }
      else{
        toast.error("Something went wrong")
      }
    }

    }
  
  return (
    <>
      {/* <div className="h-full w-screen"> */}
        <div className="grid grid-rows-[100vh] grid-cols-1 lg:grid-cols-[60%_40%] overflow-hidden">
          <div className="h-auto bg-[#aad4b0] lg:bg-white">
            <div className="w-full">
              {/* <div className="inline-flex items-center ml-10 mt-10"> */}
               <Link to='/' className="inline-flex items-center ml-10 mt-4 lg:mt-10">
                  <img src="/images/left-arrow.png" alt="<-" />
                  <span className=" cursor-pointer ml-4 text-lg hover:text-[#ef7e32]">
                    Back Home
                  </span>
               </Link>
              {/* </div> */}
            </div>
            <div className=" w-full flex justify-center">
              <div className="flex flex-col justify-center mt-[5vh]  w-auto md:w-[55%]">
                <h3 className="text-2xl md:text-4xl mb-5">{login?"Login":"Register"}</h3>
                {!login && 
               <>
                  <label htmlFor="name" className="mb-1 ">
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userDetails.username}
                    className=" lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black"
                    placeholder="Enter name"
                    onChange={(e)=>setUserDetails({...userDetails,username:e.target.value})}
                  />
               </>
                }
                <label htmlFor="email" className="mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={userDetails.email}
                  className="lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black"
                  placeholder="Enter email"
                  onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})}
                />
                <label htmlFor="pass" className="mb-1 ">
                  Password
                </label>
                <input
                  type="password"
                  name=""
                  id="pass"
                  value={userDetails.password}
                  className="lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black"
                  placeholder="Enter password"
                  onChange={(e)=>setUserDetails({...userDetails,password:e.target.value})}
                />
                {login?<button className="bg-[#2c2c2c] text-white w-[10rem] py-3 px-3 rounded-lg mt-5 hover:bg-[#f62323] " onClick={handleLogin} >
                  Login
                </button>
                :
                <button className="bg-[#2c2c2c] text-white w-[10rem] py-3 px-3 rounded-lg mt-5 hover:bg-[#f62323]" onClick={handleRegister}>
                  Register
                </button>}
                <p className="mt-4">
                  {login?"New user?":"Already registered?"} {login ? <Link to='/register'><span className="text-[#6815B6]">Sign up</span></Link>:<Link to='/login'><span className="text-[#6815B6]">Sign in</span></Link>}
                </p>
              </div>
            </div>
          </div>
          <div className="back-image hidden lg:block border border-black relative">
            <div className="absolute right-0 top-0">
              <img
                src="/images/cover-removebg-preview (1) 1.png"
                alt="logo"
                className="w-25 -my-5"
              />
            </div>
          </div>
        </div>
        {/* <ToastContainer theme='colored' position='top-center' autoClose={2000}/> */}
        <ToastContainer theme='colored' position="top-center" autoClose={2000}/>
      {/* </div> */}
    </>
  );
};

export default LoginPage;
