import React, { useEffect } from 'react'
import StatusBar from './StatusBar'

const PremiumNutrition = ({currentNutrition,animation,setAnimation}) => {
    const premiumNutrArr = [{prop_name:'vitaminC',name:'Vitamin C',value:90,unit:'mg'},{prop_name:'vitaminD',name:'Vitamin D',value:600,unit:'IU'},{prop_name:'iron',name:'Iron',value:10,unit:'mg'}]
    
    
    useEffect(()=>{
        setAnimation(false)
        setTimeout(()=>{setAnimation(true),100})
        console.log('Inside Premium Nutrition')
    },[currentNutrition])
  return (
   
          <div>
            <h1>Micronutrients</h1>
            <hr className="mb-4 border-[1px] border-slate-400 " />
                  { premiumNutrArr.map((item)=>(
                    <>
                    <div className="flex justify-between mb-1">
                   <p className="text-sm">{item.name}</p>
                   <p className="text-sm">{currentNutrition[item.prop_name]} {item.unit}</p>
                 </div>
                 <StatusBar animation={animation} small={true} curr={currentNutrition[item.prop_name]} total={item.value} />
                 <div style={{ height: "10px" }}></div>
                </>
                  ))}
            </div>
  )
}

export default PremiumNutrition