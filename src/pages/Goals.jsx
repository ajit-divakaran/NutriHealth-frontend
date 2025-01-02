import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { EditGoalsApi } from '../services/allApis';
import { isgoalsdefined } from '../context/ContextShare';

const Goals = ({edit}) => {
  // const [userDetails,setUserDetails] = useState({
  //   username:'',
  //   email:'',
  //   password:'',
  //   goals:{}

    
    
  // })
  const [userGoals, setUserGoals] = useState({
      calories:0,
      protein:0,
      carbs:0,
      fats:0
    
  })

  const {isGoalsDefined,setIsGoalsDefined} = useContext(isgoalsdefined)

  const navigate = useNavigate()
  // console.log(userDetails)
    const handleEditGoals = async() =>{
      const {calories,protein,carbs,fats} = userGoals
        // console.log(userGoals)
        console.log("Inside goal click")
        if(!calories || !protein || !carbs || !fats){
          alert("Please fill the form completely")
        }
        else
        { 
          // setUserDetails({...userDetails,goals:userGoals})
        if(sessionStorage.getItem('token')){
          const token = sessionStorage.getItem('token')
          const reqHeader = {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          }
          console.log(userGoals)
          const result =await EditGoalsApi({goals:userGoals},reqHeader)
          console.log(result.data)
          if(result.status==200){
            toast.success("Profile updated successfully")
            sessionStorage.setItem('existingUser',JSON.stringify(result.data))
        
          }
          else if(result.status==406){
            toast.warning(result.response.data)
          }
          else{
            toast.error('Something went wrong')
          }
          // navigate('/')
        }}
    }
   
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            console.log("Inside Goals page")
     
            if(JSON.parse(sessionStorage.getItem('existingUser')).goals.length>0 && !edit){
              setIsGoalsDefined(true)
              setTimeout(()=>navigate("/dashboard"),2000)
            }
          }
          else{
            navigate("/nopage")
      
          }
        
    },[])
  return (
    <>
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
                <h3 className="text-2xl md:text-4xl mb-5">What's your goal?</h3>
             
               
                  <label htmlFor="name" className="mb-1 ">
                    Calories(in kcal)
                  </label>
                  <input
                    type="number"
                    id="name"
                    
                    className=" lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black"
                    placeholder="Enter Calories"
                    onChange={(e)=>setUserGoals({...userGoals,calories:e.target.value})}
                  />
               
                
                <div className="grid grid-cols-1 md:grid-cols-[48%_48%] gap-x-[4%]">
                <div>
                    <label htmlFor="name" className="mb-1 ">
                        Protein(in gms)
                      </label>
                      <input
                        type="number"
                        id="name"
                        
                        className=" lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black w-full"
                        placeholder="Enter Calories"
                        onChange={(e)=>setUserGoals({...userGoals,protein:e.target.value})}
                      />
                </div>
                <div>
                    <label htmlFor="name" className="mb-1 ">
                        Fats(in gms)
                      </label>
                      <input
                        type="number"
                        id="name"
                        
                        className=" lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black w-full"
                        placeholder="Enter Calories"
                        onChange={(e)=>setUserGoals({...userGoals,fats:e.target.value})}                      />
                </div>
                <div>
                    <label htmlFor="name" className="mb-1 ">
                        Carbs(in gms)
                      </label>
                      <input
                        type="number"
                        id="name"
                        
                        className=" lg:text-lg py-3 px-1 pl-3 bg-slate-300 rounded mb-3 border border-black w-full"
                        placeholder="Enter Calories"
                        onChange={(e)=>setUserGoals({...userGoals,carbs:e.target.value})}                      />
                </div>
               
                </div>
               <button className="bg-[#2c2c2c] text-white w-[10rem] py-3 px-3 rounded-lg mt-5 hover:bg-[#f62323] " onClick={handleEditGoals} >
                  Submit
                </button>
                
                <p className="mt-4">
                 Confused about how to choose goals? <a href='https://healthyeater.com/flexible-dieting-calculator' target='_blank' className='underline text-[#6815B6]'>Click Here</a>
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
    </>
  )
}

export default Goals