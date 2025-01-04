import { faCirclePlus, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { faCross } from '@fortawesome/free-solid-svg-icons/faCross'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { EditUserMealApi } from '../services/allApis'


const Diet = ({setaddFood,setMealTime,userMeals,head}) => {
    const handleAdd = () =>{
        setaddFood(true)
        let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
        console.log(mealtime)
        setMealTime(mealtime)
    }

    const handleMealItemClose =() =>{
        const reqBody={}
        console.log('Deleted successfully')
        // const result = await EditUserMealApi('delete',reqBody,reqHeader)
    }

    // useEffect(()=>{
    //     const data = JSON.parse(sessionStorage.getItem(existingUser))
    // },[])
  return (
    <div className='mb-[4rem]'>
        
        <div className='flex head bg-[#384438] text-white items-center  w-[90vw] md:w-[100%] px-[1rem] justify-between 
        py-3 rounded-lg mb-1' >
            <h3>{head}</h3>
            <FontAwesomeIcon icon={faCirclePlus} onClick={handleAdd}  style={{color:'white'}}/>
        </div>
        
        {console.log(userMeals)}
           {userMeals.length>0 && 
         ( userMeals.map((item,index)=>(

            <div key={index} className="flex meal mb-1 bg-[#b9aa87] rounded-lg py-2 px-4 justify-between w-[90vw] md:w-[100%]">
                <div>
                    <p>{item.food_name}</p>
                    <h6>{item.customServing?item.customServing:item.serving} {!(item.serving.includes('(')) && item.serveUnit}</h6>
                </div>
                <div>
                    <h6>{item.calories*1} kcal<FontAwesomeIcon icon={faMultiply} className='ms-3'onClick={handleMealItemClose}/></h6>
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
        
    </div>
  )
}

export default Diet