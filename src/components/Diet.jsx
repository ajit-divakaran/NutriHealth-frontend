import { faCirclePlus, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { faCross } from '@fortawesome/free-solid-svg-icons/faCross'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'


const Diet = ({setaddFood,setMealTime,head}) => {
    const handleAdd = () =>{
        setaddFood(true)
        let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
        console.log(mealtime)
        setMealTime(mealtime)
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
        
        
           {<div className="flex meal mb-1 bg-[#b9aa87] rounded-lg py-2 px-4 justify-between w-[90vw] md:w-[100%]">
                <div>
                    <p>Tea</p>
                    <h6>1 serving(5oz)</h6>
                </div>
                <div>
                    <h6>100kcal<FontAwesomeIcon icon={faMultiply} className='ms-3'/></h6>
                </div>
            </div>}
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