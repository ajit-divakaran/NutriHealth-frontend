import { faCirclePlus, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { faCross } from '@fortawesome/free-solid-svg-icons/faCross'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { EditUserMealApi } from '../services/allApis'
import { ToastContainer, toast } from 'react-toastify';


const Diet = ({setAnimation,setaddFood,setRefreshStatus,setMealTime,userMeals,head}) => {
    // const [userDietMeals,setUserDietMeals] = useState(userMeals)
    const [editOpen, setEditOpen] = useState(false)
    const handleAdd = () =>{
        setaddFood(true)
        let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
        console.log(mealtime)
        setMealTime(mealtime)
        // userMeals = JSON.parse(sessionStorage.getItem('UsermealsToday'))[mealtime]
        // setUserDietMeals()

    }

    const handleMealItemClose =async(item) =>{
        setAnimation(false)
        let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
        console.log(mealtime)
        setMealTime(mealtime)
        const reqBody={...item}
        console.log(reqBody)
        const token= sessionStorage.getItem('token')
        const reqHeader = {
            "Content-type": "multipart/form-data",
           "Authorization": `Bearer ${token}`,
          }
        console.log('Deleted successfully')
        const result = await EditUserMealApi('delete',reqBody,reqHeader)
        if(result.status == 200 && result.data){
        // toast.info('Deleted meal successfully')
        // alert('User meal deleted sucessfully')
            sessionStorage.setItem('UsermealsToday',JSON.stringify(result.data))
            console.log(result.data)
            setRefreshStatus(result.data)
            setAnimation(true)
            // setUserDietMeals(result.data)
            
        }
        else{
            // toast.error(result.data)
            alert(result.data)
            setAnimation(true)

        }
    }
    const handleClick = (item) =>{
        console.log('Clicked: ',item)
        setEditOpen(true)
    }

    // useEffect(()=>{
    //     let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
    //     userMeals = JSON.parse(sessionStorage.getItem('UsermealsToday'))[mealtime]

    // },[userDietMeals])
  return (
    <>
        <div className='mb-[4rem]'>
            
            <div className='flex head bg-[#384438] text-white items-center  w-[90vw] md:w-[100%] px-[1rem] justify-between 
            py-3 rounded-lg mb-1' >
                <h3>{head}</h3>
                <FontAwesomeIcon icon={faCirclePlus} onClick={handleAdd}  style={{color:'white'}}/>
            </div>
            
            {console.log(userMeals)}
               {userMeals?.length>0 && 
             ( userMeals.map((item,index)=>(
    
                <div key={index} onClick={()=>handleClick(item)} className="flex meal mb-1 bg-[#b9aa87] rounded-lg py-2 px-4 justify-between w-[90vw] md:w-[100%]">
                    <div>
                        <p>{item.food_name}</p>
                        <h6>{item.customServing?item.customServing:item.serving} {!(item.serving.includes('(')) && item.serveUnit}</h6>
                    </div>
                    <div>
                        <h6>{item.calories*1} kcal<FontAwesomeIcon icon={faMultiply} className='ms-3'onClick={()=>handleMealItemClose(item)}/></h6>
                    </div>
                </div>
             )) )}
                {/* <div className="flex meal bg-[#b9aa87] px-4 rounded-lg py-2 justify-between  w-[90vw] md:w-[100%]">
                    <div>
                        <p>Tea</p>
                        <h6>1 serving(5oz)</h6>
                    </div>
                    <div>
                        <h6>100kcal<FontAwesomeIcon icon={faMultiply} className='ms-3'/></h6>
                    </div>
                </div> */}
                 <ToastContainer theme='dark' position="top-center" autoClose={2000} />
            
        </div>
        {editOpen && <div className='fixed inset-0 h-full bg-black bg-opacity-50 flex justify-center'>
<div>
                <h1 className='text-center bg-slate-200 text-black w-1/2 p-5'>Hello</h1>
                <button className='border border-white border-w-[2px] text-white px-4 py-3 rounded hover:bg-white hover:text-black' onClick={()=>setEditOpen(false)}>Close</button>
    
</div>            </div>}
    </>
  )
}

export default Diet