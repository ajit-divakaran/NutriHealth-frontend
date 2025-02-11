import { faCirclePlus, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { faCross } from '@fortawesome/free-solid-svg-icons/faCross'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { EditUserMealApi } from '../services/allApis'
import { ToastContainer, toast } from 'react-toastify';


const Diet = ({mealTime,isQuantityUpdated,quantityChangedValues,setQuantityChangedValues,setIsQuantityUpdated,setAnimation,setaddFood,setRefreshStatus,setMealTime,userMeals,head,ConditionNutrientCalculator}) => {
    // const [userDietMeals,setUserDietMeals] = useState(userMeals)
    const [currFoodId,setcurrFoodId] = useState({food_id:''})
    const [currIndex,setCurrIndex] = useState()
    const [currInputId,setCurrInputId] = useState('')
    const [currInputMeal,setCurrInputMeal] = useState('')
    console.log('Usermeal',userMeals)
    
    // const [editOpen, setEditOpen] = useState(false)
    const handleAdd = () =>{
        setQuantityChangedValues({})
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
        // setEditOpen(true)
    }

    const updateTempUMeals = (input,item) =>{
        // let mealtime = head.charAt(0).toLowerCase() + head.slice(1)
        // setMealTime(mealtime)
        let obj = JSON.parse(sessionStorage.getItem("UsermealsToday"))
        const index = obj[item.mealtime].findIndex(x=>x.food_id==item.food_id)
        console.log('index',index)
        setCurrIndex(index)
        if(index!==-1){        
            obj[item.mealtime][index].quantity = input
            setQuantityChangedValues(obj)
            console.log(obj)
            // setRefreshStatus(obj)
            setAnimation(true)

        // console.log('Mealtime', mealtime)
        // console.log('Calculate nutrition')
        // let newCal = item.calories
        // let newCarbs = item.carbs
        // let newPro = item.protein
        // let newFat = item.fat
        // console.log('Inside calculate quamtity', input)
            //{ // if(input > obj[mealtime][index].quantity){
            // newCal = (newCal/item.quantity)*input*1;
            // newCarbs = (newCarbs/item.quantity)*input*1;
            // newPro = (newPro/item.quantity)*input*1;
            // newFat = (newFat/item.quantity)*input*1;
          
            // // console.log()
            
           
            //     obj[mealtime][index].calories = newCal.toFixed(2)*1
            //     obj[mealtime][index].carbs = newCarbs.toFixed(2)*1
            //     obj[mealtime][index].fat = newFat.toFixed(2)*1
            //     obj[mealtime][index].protein = newPro.toFixed(2)*1}
                // sessionStorage.setItem('UsermealsToday',JSON.stringify(obj))

                // console.log(obj[index].quantity,obj)
        
            // }
            // else{
            // newCal = newCal/quantity*1;
            // newCarbs = newCarbs/quantity*1;
            // newPro = newPro/quantity*1;
            // newFat = newFat/quantity*1;
            // // console.log()
            //     obj[mealtime][index].quantity = quantity
            //     obj[mealtime][index].calories = newCal
            //     obj[mealtime][index].carbs = newCarbs
            //     obj[mealtime][index].fat = newFat
            //     obj[mealtime][index].protein = newPro
            //     sessionStorage.setItem('UsermealsToday',JSON.stringify(obj))
            //     setRefreshStatus(obj)
            //     setAnimation(true)
            // }
        }
    }

    const handleQuantity = (e,item) =>{
        const input = e.target.value
        const id = e.target.id
        console.log(id,'Input',input)
        setCurrInputId(id)
        setCurrInputMeal(item.mealtime)
        console.log(typeof input)
        setIsQuantityUpdated(true)
        setcurrFoodId({food_id:item.food_id})

        updateTempUMeals(input,item)
    }

    // const handleCal = (item,index) =>{
    //     let tempCal = item.calories
    //     if(item.customServing){
    //         tempCal = (tempCal*item.customServing)/100
    //     }
    //     else if(item.serveUnit=='serving'){
    //         tempCal = tempCal*item.serving
    //     }
    //     else{
    //         tempCal = (tempCal*item.serving)/100
    //     }

    //     if(Object.keys(quantityChangedValues).length>0){
    //         tempCal = ((tempCal*item.customServing)/100)*(quantityChangedValues[item.mealtime][index].quantity*1)
    //     }
    //     return tempCal + 'kcal'
    // }

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
                    <div className=''>
                        <p>{item.food_name}</p>
                        {/* {Object.keys(quantityChangedValues).length?console.log(quantityChangedValues[mealTime][currIndex]):console.log('0')}// condition of quantity */}
                        {/* quantityChangedValues.length?quantityChangedValues[mealTime][currIndex].quantity*1: */}
                        {/* value={Object.keys(quantityChangedValues).length?quantityChangedValues[mealTime][currIndex].quantity*1:item.quantity} */}
                        {/* {console.log(item.mealtime)}
                        {console.log(Object.keys(quantityChangedValues).length>0?quantityChangedValues[item.mealTime]:'hello')} */}
                        {console.log(item.quantity)}
                        <h6 className='my-2'><input type="number" name="" id={index} className='w-1/4 bg-white bg-opacity-[0.5] rounded' onChange={(e)=>handleQuantity(e,item)} value={Object.keys(quantityChangedValues).length>0?quantityChangedValues[item.mealtime][index].quantity:item.quantity*1} min={1} step={0.5}/> x {
                        item.customServing?
                        (item.serving.split('-')[1]=='foodMeasure'?item.serving.split('-')[0]:item.customServing)
                        :item.serving
                        } {!(item.serving.includes('(')) && item.serveUnit}</h6>
                    </div>
                    <div>
                        {
                        // console.log("Quantity id",quantity.food_id,"item.calories",item.calories)
                        
                        
                        }
          
                        {/* <h6>{Object.keys(quantityChangedValues).length && quantityChangedValues.food_id == item.food_id?(quantityChangedValues[mealTime][currIndex].quantity*1)*(quantityChangedValues[mealTime][currIndex].calories*1):item.calories*item.quantity*1} kcal</h6> */}

                        {/* <h6>{Object.keys(quantityChangedValues).length>0? currIndex==index && handleCal(item,index):item.calories*(item.quantity*1)}</h6> */}
                        <h6>{(ConditionNutrientCalculator(index,item,'calories')*1).toFixed(2)} kcal</h6>
                        {/* <h6>{isQuantityUpdated && currIndex==index &&}</h6> */}
                    </div>
                    <div>
                    <FontAwesomeIcon icon={faMultiply} className='ms-3'onClick={()=>handleMealItemClose(item)}/>
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
        {/* {editOpen && <div className='fixed inset-0 h-full bg-black bg-opacity-50 flex justify-center'>
<div>
                <h1 className='text-center bg-slate-200 text-black w-1/2 p-5'>Hello</h1>
                <button className='border border-white border-w-[2px] text-white px-4 py-3 rounded hover:bg-white hover:text-black' onClick={()=>setEditOpen(false)}>Close</button>
    
</div>            </div>} */}
    </>
  )
}

export default Diet