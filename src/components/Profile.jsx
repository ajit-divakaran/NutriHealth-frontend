import { faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useEffect, useState } from 'react'
import { isgoalsdefined, removeProfileDiv } from '../context/ContextShare'
import { Link, useNavigate } from 'react-router-dom'
// import React, { useState } from 'react'

const Profile = ({setLoginStatus}) => {
const {show,setShow,showgoal,setShowgoal} = useContext(removeProfileDiv)
const {isGoalsDefined,setIsGoalsDefined} = useContext(isgoalsdefined)
const [ugoal,setUgoal] = useState({
  calories:1,
  protein:1,
  fats:1,
  carbs:1

})
const [uname,setUname] = useState(null)
const navigate = useNavigate()
const handleLogout = () =>{
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('existingUser')
  setLoginStatus(false)
  setIsGoalsDefined(false)
  setTimeout(()=>navigate('/'),2000)
}

useEffect(()=>{
  if(JSON.parse(sessionStorage.getItem("existingUser")).goals.length>0){
    const existingUser = sessionStorage.getItem('existingUser')
    const userObj = JSON.parse(existingUser)
    setIsGoalsDefined(true)
    setUname(userObj.username)
    setUgoal({
      calories:userObj.goals[0].calories,
      protein:userObj.goals[0].protein,
      fats:userObj.goals[0].fats,
      carbs:userObj.goals[0].carbs
    })
  }
  else if(sessionStorage.getItem("existingUser")){
    const existingUser = sessionStorage.getItem('existingUser')
    const userObj = JSON.parse(existingUser)
    setIsGoalsDefined(false)
    setUname(userObj.username)
  }
  else{
    alert("No user found")
  }
},[])
  return (
    <div className='relative md:mr-[5.5rem]'>
        <img src="images/Profile.png" alt="" onClick={()=>setShow(!show)} width={'55rem'}/>
        {show && <div className='p-4 mt-3 absolute right-10 bg-white z-10 w-[15rem]'>
        <p className='my-2'>Hello {uname}</p>
        <hr className='h-[1.5px] bg-slate-400'/>
        <p className='text-bold mt-2'>Nutritional Goal<FontAwesomeIcon icon={faMinus} onClick={()=>setShowgoal(!showgoal)} className='ms-2'/></p>
        {showgoal && <div className='ms-2'>
          {console.log(isGoalsDefined)}
           { isGoalsDefined ?
           <>
             <p>Calories: {isGoalsDefined?ugoal.calories:0}kcal</p>
              <p>Protein: {isGoalsDefined?ugoal.protein:0}g</p>
              <p>Carbs: {isGoalsDefined?ugoal.carbs:0}g</p>
              <p>Fats: {isGoalsDefined?ugoal.fats:0}g</p>
           </>:
           <p className='mt-3'>No goals found</p>
          }
        </div>}
{   isGoalsDefined?     <Link to={'/edit-goals'}><button className='bg-black text-white rounded-md px-4 py-2 my-2' >Edit goals</button></Link>:
                 <Link to={'/goals'}><button className='bg-black text-white rounded-md px-4 py-2 my-2' >Add goals</button></Link>
}        <hr className='h-[1.5px] bg-slate-400'/>
        <button className='bg-black text-white rounded-md px-4 py-2 my-2' onClick={handleLogout}>Logout</button>
        </div>}
    </div>
  )
}

export default Profile